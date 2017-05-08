var models = require(__base + 'models.js');
var validator = require('validator');
var nodemailer = require('nodemailer');
var request = require('request');

var INVENTORY_BASE_URL = "http://vm343b.se.rit.edu/inventory/";
var MIN_BUSINESS_QUANTITY = 100;

module.exports = {

	createCustomer: function(info) {
		var self = this;
		
		return new Promise(function(resolve, reject) {
			models.TaxRates.findAll().then(function(states) {
				
				var response = {errors:{}, success: false};
				
				function validateAddress(prefix) {
					if(!info.hasOwnProperty(prefix + "_firstname") || info[prefix + "_firstname"].length < 2) {
						response.errors[prefix + "_firstname"] = 'To short';
					} else if(info[prefix + "_firstname"].length > 50) {
						response.errors[prefix + "_firstname"] = 'To long';
					}
							
					if(!info.hasOwnProperty(prefix + "_lastname") || info[prefix + "_lastname"].length < 2) {
						response.errors[prefix + "_lastname"] = 'To short';
					} else if(info[prefix + "_lastname"].length > 50) {
						response.errors[prefix + "_lastname"] = 'To long';
					}
					
					if(!info.hasOwnProperty(prefix + "_address") || info[prefix + "_address"] < 3) {
						response.errors[prefix + "_address"] = 'Invalid street address';
					}

					if(!info.hasOwnProperty(prefix + "_city") || info[prefix + "_city"] < 3) {
						response.errors[prefix + "_city"] = 'Invalid city';
					}

					var zipPattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
					if(!info.hasOwnProperty(prefix + "_zipcode") || !zipPattern.test(info[prefix + "_zipcode"])) {
						response.errors[prefix + "_zipcode"] = 'Invalid zipcode';
					}

					if(!info.hasOwnProperty(prefix + "_state")) {
						response.errors[prefix + "_state"] = 'Select a state'
					} else {
						var foundState = false;
						states.forEach(function(st) {
							if(st.id == info[prefix + "_state"]) {
								foundState = true;
								return;
							}
						});

						if(!foundState) {
							errors[prefix + "_state"] = 'Invalid State';
						}
					}
				}
	
				// validate customer info
				if(info.hasOwnProperty("company")) {
					if(info.company.length < 2) {
						response.errors.company = 'To short';
					} else if(info.company.length > 50) {
						response.errors.company = 'To long';
					}
				}
				
				if(!info.hasOwnProperty("email") || !validator.isEmail(info.email)) {
					response.errors.email = 'Invalid email';
				}
				
				var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
				if(!info.hasOwnProperty("phone") || !patt.test(info.phone)) {
					response.errors.phone = 'Invalid phone number';
				}
				
				// Validate credit card info
				if(!info.hasOwnProperty("card_number") || !validator.isCreditCard(info.card_number)) {
					response.errors.card_number = 'Invalid credit card';
				}
				
				if(!info.hasOwnProperty("cvc") || info.cvc.length != 3 || isNaN(parseInt(info.cvc))) {
					response.errors.cvc = 'Invalid CVC code';
				}
				
				var validExpirationDate = true;
				if(!info.hasOwnProperty("expiration_month")) {
					response.errors.expiration_month = 'Invalid';
					validExpirationDate = false;
				} 
				
				if(!info.hasOwnProperty("expiration_year")) {
					response.errors.expiration_year = 'Invalid';
					validExpirationDate = false;
				}
				
				if(validExpirationDate) {
					info.expiration_date = new Date(info.expiration_year + "/" + info.expiration_month + "/01");
					if(info.expiration_date == null || isNaN(info.expiration_date.getTime())) {
						response.errors.expiration_year = 'Invalid';
						response.errors.expiration_month = 'Invalid';
					}
				}
				
				// Validate the shipping address
				validateAddress("shipping");
				
				// Validate the billing address
				validateAddress("billing");

				// If there are no response.errors create the objects
				if(Object.keys(response.errors).length == 0) {
					var customerData = {
						"password": "",
						"phoneNumber": info.phone,
						"email": info.email,
						"company": null
					}
					
					if(info.hasOwnProperty("company")) {
						customerData.company = info.company;
					}
					
					models.Customer.create(customerData).then(function(customer) {
						
						var billingAddressData = {
							address: info.billing_address,
							city: info.billing_city,
							zip: info.billing_zipcode,
							stateId: info.billing_state,
							firstName: info.billing_firstname,
							lastName: info.billing_lastname,
							customerId: customer.id,
						}
						
						var shippingAddressData = {
							address: info.shipping_address,
							city: info.shipping_city,
							zip: info.shipping_zipcode,
							stateId: info.shipping_state,
							firstName: info.shipping_firstname,
							lastName: info.shipping_lastname,
							customerId: customer.id,
						}
						
						models.Address.create(shippingAddressData).then(function(shippingAddress) {
							models.Address.create(billingAddressData).then(function(billingAddress) {
								
								var paymentData = {
									cardNumber: info.card_number,
									CVC: info.cvc,
									expirationDate: info.expiration_date,
									billingAddressId: billingAddress.id,
								}	
								
								models.PaymentMethod.create(paymentData).then(function(payment) {
									response.success = true;
									response.customer = customer;
									resolve(response);
								}).catch(function(err) {
									response.err = err;
									reject(response);
								});
							}).catch(function(err) {
								response.err = err;
								reject(response);
							});
						}).catch(function(err) {
							response.err = err;
							reject(response);
						});
						
					}).catch(function(err) {
						response.err = err;
						reject(response);
					});
				
				} else {
					reject(response);
				}
			});
		});
	},
	
	createOrder: function(info, business) {
		var self = this;
		
		return new Promise(function(resolve, reject) {
			// Load the phones
			request(INVENTORY_BASE_URL + 'models/all', function (error, response, body) {
				
				var phoneModels = [];
				
				// Check if the request was successful
				if (!error && response.statusCode === 200) {
					phoneModels = JSON.parse(body).map(function(model) {
						return model;
					});
				};
				
				// Build the base response message
				var response = {errors:{}, success: false};
				
				var totalCost = 0;
				var totalQuantity = 0;
				
				// Calculate the total order price and check that all the phones selected are valid
				if(info.hasOwnProperty("phone")) {
					info.phone.forEach(function(val, index) {
						if(typeof phoneModels[index] !== 'undefined') {
							var quanity = parseInt(val.quantity);
							totalCost += phoneModels[index].price * quanity;
							totalQuantity += quanity;
						} else {
							response.errors.invalidPhone = "An invalid phone was selected.";
						}
					});
				}
				
				if(Object.keys(response.errors).length == 0) {
					
					if(business) {
						// Business customer checkout
						var customerId = parseInt(info.customer);
						
						// Businesses have a min quanity requirement
						if(totalQuantity < MIN_BUSINESS_QUANTITY) {
							response.errors.lowQuanity = "Minimum phone quantity is " + MIN_BUSINESS_QUANTITY;
							reject(response);
						} 
						
						// Check that the customer exists
						models.Customer.findOne({
							where: {
								id: customerId,
							}
						}).then(function(customer) {
							
							// Validate shipping address
							models.Address.findOne({
								where: {
									customerId: customer.id,
									id: parseInt(info.shipping)
								}
							}).then(function(shippingResults) {
								// Check that we got a result back
								if(shippingResults.length == 0) {
									throw 'Invalid';
								}
								
								// Validate payment method
								models.PaymentMethod.findOne({
									where: {
										id: parseInt(info.payment),
									},
									include: [
										{ 
											model: models.Address,
											as: "billingAddress",
											where: {
												customerId: customer.id,
											}
										}
									]
								}).then(function(billingResults) {
									// Check that we got a result back
									if(billingResults.length == 0) {
										throw 'Invalid';
									}
									
									// Everything checks out so place order
									var orderInfo = {
										totalItemCost: totalCost,
										shippingCost: 0,
										orderDate: new Date(),
										isPaid: true,
										taxPercentage: .06,
										customerId: customer.id,
										shippingAddressId: shippingResults.id,
										paymentMethodId: billingResults.id,
									}
									
									models.Orders.create(orderInfo).then(function(orderResult) {
									
										var orderItems = [];
										
										// Create the actual items
										info.phone.forEach(function(val, index) {
											// Create order item for each phone
											for(var x = 0; x < val.quantity; x++) {
												// TODO: get a new serial number
												// TODO: Calculate refund/replace deadlines
												orderItems.push({
													serialNumber: 1,
													modelId: index,
													price: phoneModels[index].price,
													isPaid: true,
													replacementDeadline: new Date(),
													refundDeadline: new Date(),
													orderId: orderResult.id
												});
											}
						
										});
										
										// Run query to create items
										models.Item.bulkCreate(orderItems).then(function() {
											response.success = true;
											response.order = orderResult;
											response.customer = customer;
											response.items = orderItems.length;
											resolve(response);
										}).catch(function(err) {
											response.errors.address = "Couldn't place order";
											response.err = err;
											reject(response);
										});
										
									}).catch(function(err) {
										response.errors.address = "Failed to place order";
										reject(response);
									});
									
								}).catch(function(err) {
									response.errors.address = "Payment method is invalid";
									reject(response);
								});
								
							}).catch(function(err) {
								response.errors.address = "Shipping address is invalid";
								reject(response);
							});
						}).catch(function(err) {
							response.errors.invalidCustomer = "Customer is invalid";
							reject(response);
						});
		
					} else {
						// Normal customer checkout
					}	
				} else {
					reject(response);
				}
			});
		});
	},
	
	sendEmail: function(phoneModel) {
		return new Promise(function(resolve, reject) {
			var emails = ["nns3455@rit.edu"];
			
			var transporter = nodemailer.createTransport({
				"service" : "gmail",
				"auth" : {
					"user" : "krutzcorpsales@gmail.com",
					"pass" : "Team$ales"
				}
			});
			
			var mailOptions = {
				"from" : '"KrutzCorp Sales" <krutzcorpsales@gmail.com>',
				"to" : emails.join(),
				"subject" : "Phone Recall",
				"text" : "We recalled your phone, hit dat mufukin like button",
				"html" : "<h1>We recalled your phone, hit surbscrib and SMASH dat mufukin like button</h1>"
			};
			
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log("Messages sent successfully");
			});
			resolve();
		});
	}
}
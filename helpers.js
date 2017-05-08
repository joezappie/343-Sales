var models = require(__base + 'models.js');
var validator = require('validator');
var nodemailer = require('nodemailer');

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
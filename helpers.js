var models = require(__base + 'models.js');
var validator = require('validator');

module.exports = {
	createCustomer: function(info) {
		return new Promise(function(resolve, reject) {
			models.TaxRates.findAll().then(function(states) {
	
				var response = {errors:{}, success: false};
				
				// validate customer info
				if(!info.hasOwnProperty("lastName") || info.lastName.length < 2) {
					response.errors.lastName = 'To short';
				} else if(info.lastName.length > 50) {
					response.errors.lastName = 'To long';
				}
				
				if(!info.hasOwnProperty("firstName") || info.firstName.length < 2) {
					response.errors.firstName = 'To short';
				} else if(info.firstName.length > 50) {
					response.errors.firstName = 'To long';
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

				if(!info.hasOwnProperty("address") || info.address < 3) {
					response.errors.address = 'Invalid street address';
				}

				if(!info.hasOwnProperty("city") || info.city < 3) {
					response.errors.city = 'Invalid city';
				}

				var zipPattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
				if(!info.hasOwnProperty("zipcode") || !zipPattern.test(info.zipcode)) {
					response.errors.zipcode = 'Invalid zipcode';
				}

				if(!info.hasOwnProperty("state")) {
					response.errors.state = 'Select a state'
				} else {
					var foundState = false;
					states.forEach(function(st) {
						if(st.id == info.state) {
							foundState = true;
							return;
						}
					});

					if(!foundState) {
						response.errors.state = 'Invalid State';
					}
				}
				
				// Ensure isCompany is boolean
				info.isCompany = (info.hasOwnProperty("isCompany") && (info.isCompany == true || info.isCompany == '1' || info.isCompany == 'true'));
				
				// If there are no response.errors create the objects
				if(Object.keys(response.errors).length == 0) {
					var customerData = {
						password: "",
						phoneNumber: info.phone,
						email: info.email,
						firstName: info.firstName,
						lastName: info.lastName,
						isCompany: info.isCompany,
					}

					models.Customer.create(customerData).then(function(customer) {
						var addressData = {
							address: info.address,
							city: info.city,
							zip: info.zipcode,
							stateId: info.state,
							customerId: customer.id,
							firstName: customer.firstName,
							lastName: customer.lastName,
						}
						
						models.Address.create(addressData).then(function(address) {
							var paymentData = {
								cardNumber: info.card_number,
								CVC: info.cvc,
								expirationDate: info.expiration_date,
								billingAddressId: address.id,
							}
							
							models.PaymentMethod.create(paymentData).then(function(payment) {
								response.success = true;
								resolve(response);
							}).catch(function(err) {
								reject(response);
							});
						}).catch(function(err) {
							reject(response);
						});
						
					}).catch(function(err) {
						reject(response);
					});
				
				} else {
					reject(response);
				}
			});
		});
	}
}
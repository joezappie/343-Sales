var express = require('express');
var request = require('request');
var models = require(__base + 'models.js');
var validator = require('validator');
var router = express.Router();

// Route requires
router.use('/api', require('./api'));
router.use('/consumed', require('./consumed'));

var INVENTORY_BASE_URL = "http://vm343b.se.rit.edu:5000/inventory/";
var SALES_BASE_URL = "http://vm343c.se.rit.edu/"
var LOCAL_BASE_URL = "http://localhost:8080/"

/* GET home page. */
router.get('/', function(req, res, next) {
	request(INVENTORY_BASE_URL + 'models/all', function (error, response, body) {
		if (!error && response.statusCode === 200) {
			//console.log(typeof(body));
			var phoneModels = JSON.parse(body).map(function(model) {
				return model[0];
			});

			res.render('pages/index', { phoneModels: phoneModels });
		} else {
			res.render('pages/index');
		}
	});
});

router.get('/salesRep', function(req, res) {
	var phoneModels = [];
	request(INVENTORY_BASE_URL + 'models/all', function (error, response, body) {
		if (!error && response.statusCode === 200) {
			phoneModels = JSON.parse(body).map(function(model) {
				return model[0];
			});
			
			models.Customer.findAll({
				where: {
					isCompany: true,
				}
			}).then(function(customers) {
				models.TaxRates.findAll().then(function(states) {
					res.render('pages/salesRep', { phoneModels: phoneModels, customers: customers, states: states });
				});
			});
		};
	});
});

router.get('/apiTest', function(req, res) {
	res.render('pages/apiTest');
});

router.get('/shoppingCart', function(req, res) {
	res.render('pages/shoppingCart');
});

router.all('/newCustomer', function(req, res) {
	models.TaxRates.findAll().then(function(states) {
		if(req.method == 'POST') {
			var errors = [];
			
			if(req.body.lastName.length < 2) {
				errors.push({'input': 'lastName', 'msg':'To short'});
			} else if(req.body.lastName.length > 50) {
				errors.push({'input': 'lastName', 'msg':'To long'});
			}
			
			if(req.body.firstName.length < 2) {
				errors.push({'input': 'firstName', 'msg':'To short'});
			} else if(req.body.firstName.length > 50) {
				errors.push({'input': 'firstName', 'msg':'To long'});
			}
			
			if(!validator.isEmail(req.body.email)) {
				errors.push({'input': 'email', 'msg':'Invalid email'});
			}
			
			var patt = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
			if(!patt.test(req.body.phone)) {
				errors.push({'input': 'phone', 'msg':'Invalid phone number'});
			}
			
			
			if(errors.length == 0) {
				// Validated so create the objects
				
				var customerData = {
					password: "",
					phoneNumber: req.body.phone,
					email: req.body.email,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					isCompany: true,
				}

				models.Customer.create(customerData).then(function(customer) {
					var addressData = {
						address: req.body.address,
						city: req.body.city,
						zip: req.body.zipcode,
						stateId: req.body.state,
						customerId: customer.id,
						firstName: customer.firstName,
						lastName: customer.lastName,
					}
					
			
					models.Address.create(addressData).then(function(address) {
						
						var expirationDate = new Date(req.body.expiration_date);
						
						var paymentData = {
							cardNumber: req.body.card_number,
							CVC: req.body.cvc,
							expirationDate: expirationDate.getTime() / 1000,
							billingAddressId: address.id,
						}
						
						models.PaymentMethod.create(paymentData).then(function(payment) {
							res.render('pages/newCustomer', {states: states, errors: errors});
						}).catch(function(err) {
							res.json(err);
						});
					}).catch(function(err) {
						res.json(err);
					});
					
				}).catch(function(err) {
					res.json(err);
				});
			
			} else {
				res.render('pages/newCustomer', {states: states, errors: errors});
			}
		} else {
			res.render('pages/newCustomer', {states: states});
		}
		
	});
});

module.exports = router;

var express = require('express');
var request = require('request');
var models = require(__base + 'models.js');
var helpers = require(__base + 'helpers.js');
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
		
		var phoneModels = [];
		
		// Check if the request was successful
		if (!error && response.statusCode === 200) {
			phoneModels = JSON.parse(body).map(function(model) {
				return model[0];
			});
		} 
		
		res.render('pages/index', { phoneModels: phoneModels });
	});
});

router.get('/salesRep', function(req, res) {
	var phoneModels = [];
	request(INVENTORY_BASE_URL + 'models/all', function (error, response, body) {
		var phoneModels = [];
		
		// Check if the request was successful
		if (!error && response.statusCode === 200) {
			phoneModels = JSON.parse(body).map(function(model) {
				return model;
			});
		};
		
		models.Customer.findAll({
			where: {
				isCompany: true,
			}
		}).then(function(customers) {
			models.TaxRates.findAll().then(function(states) {
				res.render('pages/salesRep', { phoneModels: phoneModels, customers: customers, states: states });
			}).catch(function(err) {
				res.send(err);
			});
		}).catch(function(err) {
			res.send(err);
		});
	});
});

router.get('/apiTest', function(req, res) {
	res.render('pages/apiTest');
});

router.get('/recall', function(req, res, next) {
	res.render('pages/recallForm');
});

router.post('/recall', function(req, res, next) {
	var phoneModel = req.body.phoneModel;
	request(INVENTORY_BASE_URL + 'recall/' + phoneModel, function (error, response, body) {
		helpers.sendEmail(1).then(function() {
			res.render('pages/recallForm');
		});
	});
});

router.get('/shoppingCart', function(req, res) {
	models.TaxRates.findAll().then(function(states) {
		console.log("test");
		console.log(states);
		res.render('pages/shoppingCart', { states: states });
	});
});

router.get('/customerCheckout', function(req, res) {
	models.TaxRates.findAll().then(function(states) {
		res.render('pages/customerCheckout', {states: states});
	});
});

router.get('/newCustomer', function(req, res) {
	models.TaxRates.findAll().then(function(states) {
		res.render('pages/newCustomer', {states: states});
	});
});

module.exports = router;

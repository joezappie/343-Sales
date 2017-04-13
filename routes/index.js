var express = require('express');
var request = require('request');
var async = require('async');
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
			var customers = [];
			request(SALES_BASE_URL + 'api/customer/', function (error, response, body) {
				if (!error && response.statusCode === 200) {
					customers = JSON.parse(body).map(function(cust) {
						return cust;
					});
					var states = [];
					request(SALES_BASE_URL + 'api/states/', function (error, response, body) {
						if (!error && response.statusCode === 200) {
							states = JSON.parse(body).map(function(st) {
								return st;
							});
							res.render('pages/salesRep', { phoneModels: phoneModels, customers: customers, states: states });
						}
					});
				}
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

router.get('/newCustomer', function(req, res) {
	res.render('pages/newCustomer');
});

module.exports = router;

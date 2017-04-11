var express = require('express');
var request = require('request');
var async = require('async');
var router = express.Router();

// Route requires
router.use('/api', require('./api'));
router.use('/consumed', require('./consumed'));

var INVENTORY_BASE_URL = "http://vm343b.se.rit.edu:5000/inventory/";
var SALES_BASE_URL = "http://vm343c.se.rit.edu/"

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
			//console.log(phoneModels);
			res.render('pages/salesRep', { phoneModels: phoneModels });
		} else {
			res.render('pages/salesRep');
		}
	});

	var customers = [];
	request(SALES_BASE_URL + 'api/customer/', function (error, response, body) {
		if (!error && response.statusCode === 200) {
			customers = JSON.parse(body).map(function(cust) {
				return cust[0];
			});
			//console.log(customers);
			res.render('pages/salesRep', { customers: customers });
		} else {
			res.render('pages/salesRep');
		}
	});
});

router.get('/apiTest', function(req, res) {
	res.render('pages/apiTest');
});

router.get('/shoppingCart', function(req, res) {
	res.render('pages/shoppingCart');
});

module.exports = router;

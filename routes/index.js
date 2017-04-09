var express = require('express');
var request = require('request');
var router = express.Router();

// Route requires
router.use('/api', require('./api'));
router.use('/consumed', require('./consumed'));

var INVENTORY_BASE_URL = "http://vm343b.se.rit.edu:5000/inventory/";

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

router.get('/apiTest', function(req, res) {
	res.render('pages/apiTest');
});

router.get('/salesRep', function(req, res) {
	res.render('pages/salesTest');
});

router.get('/shoppingCart', function(req, res) {
	res.render('pages/shoppingCart');
});

module.exports = router;

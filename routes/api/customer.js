var express = require('express');
var router = express.Router();

var database = require(__base + 'database.js');
var db = new database();


router.get('/', function(req, res, next) {
	var cust = [];
	db.query('select id, firstName, lastName, email, phoneNumber from Customer',
		function(error, results, fields, response) {
			results.forEach(function(data) {
				var found = true;
				if(req.param('firstName') != null) {
					if(!data['firstName'].includes(req.param('firstName'))) {
						found = false;
					};
				};

				if(req.param('lastName') != null && found) {
					if(!data['lastName'].includes(req.param('lastName'))) {
						found = false;
					};
				};

				if(req.param('email') != null && found) {
					if(!data['email'].includes(req.param('email'))) {
						found = false;
					};
				};

				if(req.param('phone') != null && found) {
					if(!data['phoneNumber'].includes(req.param('phone'))) {
						found = false
					};
				};

				if(found == true) {
					cust.push(data);
				};
		});
		var responseObj = {
			"customers": cust
		};
		res.json(responseObj);
	});
});

module.exports = router;

var models = require(__base + 'models.js');
var helpers = require(__base + 'helpers.js');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	
	var where = {};
	
	if(req.param('firstName') != null) {
		where.firstName = { like: "%" + req.param('firstName') + "%" };
	}
	
	if(req.param('lastName') != null) {
		where.lastName = { like: "%" + req.param('lastName') + "%" };
	}
	
	if(req.param('email') != null) {
		where.email = req.param('email');
	}
	
	if(req.param('phoneNumber') != null) {
		where.phoneNumber = req.param('phoneNumber');
	}
	
	if(req.param('isCompany') != null) {
		where.isCompany = true;
	}
	
	models.Customer.findAll({
		where: where,
		attributes: { exclude: ['password'] },
	}).then(function(results) {
		res.json(results);
	});
});

router.post('/create', function(req, res, next) {
	helpers.createCustomer(req.body).then(function(errors) {
		res.json(errors);
	}, function(errors) {
		res.json(errors);
	}).catch(function(errors) {
		res.json({failed: true});
	});
});

module.exports = router;

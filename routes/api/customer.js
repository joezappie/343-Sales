var models = require(__base + 'models.js');
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
	
	models.Customer.findAll({
		where: where
	}).then(function(results) {
		res.json(results);
	});
});

module.exports = router;

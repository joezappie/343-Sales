var models = require(__base + 'models.js');
var express = require('express');
var Sequelize = require('sequelize');

var router = express.Router();

var orders = {};

router.get('/', function(req,res,next){
	
	res.type('json');

	var where = {};
	
	if(req.param('orderId') != null) {
		where.id = parseInt(req.param('orderId'));
	} else {
		res.status(400).send('400 Bad request: invalid parameters');
		return;
	}
	
	models.Orders.findOne({
		where: where,
		 include: [{ all: true, nested: true }]
	}).then(function(order) { 
		res.json(order);
	}).catch(function(err) {
		res.json({error: err});
	});  
	
});

router.get('/search', function(req,res,next){
	res.type('json');
	
	var where = {};
	var include = [{ all: true, nested: true }];
	var addressQuery = {};
	var customerQuery = {};
	var stateQuery = {};
		
	if(req.param('customerId') != null) {
		where.customerId = parseInt(req.param('customerId'));
	}
	
	if(req.param('city')) {
		addressQuery.city = {like: "%" + req.param('city') + "%"};
	}
	
	if(req.param('zipCode')) {
		addressQuery.zip = req.param('zipCode');
	}
	
	if(req.param('state')) {
		stateQuery = {
			state: {like: "%" + req.param('state') + "%"}
		}
	}
	
	if(req.param('address')) {
		var addressParts = [];
		req.param('address').split(" ").forEach(function(value, index) {
			addressParts.push({like: "%" + value + "%"});
		});
		addressQuery.address = {$or: addressParts};
	}
	
	if(req.param('firstName')) {
		customerQuery.firstName = {like: "%" + req.param('firstName') + "%"};
	}
	
	if(req.param('lastName')) {
		customerQuery.lastName = {like: "%" + req.param('lastName') + "%"};
	}
	
	if(req.param('billingAddress')) {
		include.push({ 
			model: models.PaymentMethod,
			as: 'paymentMethod',
			include: [generateAddressInclude('billingAddress')],
		});
	} else {
		include.push(generateAddressInclude('shippingAddress'));
	}
	
	models.Orders.findAll({
		where: where,
		include: include
	}).then(function(orders) { 
		res.json(orders);
	}).catch(function(err) {
		res.json({error: err});
	});
	
	function generateAddressInclude(association) {
		var include = { 
			model: models.Address,
			as: association,
			where: addressQuery,
			include: [{
				model: models.Customer,
				as: 'customer',
				where: customerQuery
			}, {
				model: models.TaxRates,
				as: 'state',
				where: stateQuery,
			}],
		}
		
		return include;
	}
});


module.exports = router;

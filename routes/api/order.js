var models = require(__base + 'models.js');
var express = require('express');
var Sequelize = require('sequelize');
var helpers = require(__base + 'helpers.js');

var router = express.Router();

var orders = {};

router.get('/', function(req,res,next){
	
	res.type('json');

	var where = {order: {}};
	
	var orderId = parseInt(req.param('orderId'));
	
	if(!isNaN(orderId)) {
		where.order.id = parseInt(req.param('orderId'));
	} else {
		res.status(400).send('400 Bad request: invalid parameters');
		return;
	}
	
	var orderSearch = generateOrderSearch(where);
	
	models.Orders.findOne(orderSearch).then(function(order) { 
		res.json(order);
	}).catch(function(err) {
		res.json({error: err});
	});  
	
});

router.post('/placeOrder', function(req,res,next) {
	var customerId;
	var items = req.body.items;
	
	helpers.createCustomer(req.body).then(function(customerRes) {
		if (!customerRes.success) {
			res.status(400).json(customerInfo.errors);
		}

		helpers.createOrder(customerId, items).then(function(orderRes) {
			if (!orderRes.success) {
				res.status(400).json(orderRes.errors);
			}
			
			res.json(orderRes.items);
		});
	});
});

router.post('/placeBusinessOrder', function(req,res,next) {
	helpers.createOrder(req.body, true).then(function(response) {
		res.json(response);
	}).catch(function(response) {
		res.json(response);
	});
});

router.get('/search', function(req,res,next){
	res.type('json');
	
	var where = {order: {}, customer: {}, address: {}, };
	var searchBillingAddress = false;
		
	if(req.param('customerId') != null) {
		where.order.customerId = parseInt(req.param('customerId'));
	}
	
	if(req.param('city')) {
		where.address.city = {like: "%" + req.param('city') + "%"};
	}
	
	if(req.param('zipCode')) {
		where.address.zip = req.param('zipCode');
	}
	
	if(req.param('address')) {
		var addressParts = [];
		req.param('address').split(" ").forEach(function(value, index) {
			addressParts.push({like: "%" + value + "%"});
		});
		where.address.address = {$or: addressParts};
	}
	
	if(req.param('state')) {
		where.state = {
			state: {like: "%" + req.param('state') + "%"}
		}
	}
	
	if(req.param('firstName')) {
		where.customer.firstName = {like: "%" + req.param('firstName') + "%"};
	}
	
	if(req.param('lastName')) {
		where.customer.lastName = {like: "%" + req.param('lastName') + "%"};
	}
	
	var orderSearch = generateOrderSearch(where, req.param('billingAddress'));
	
	models.Orders.findAll(orderSearch).then(function(orders) { 
		res.json(orders);
	}).catch(function(err) {
		res.json({error: err});
	});
});

function generateOrderSearch(where, searchBillingAddress) {
	return {
		where: where.order,
		attributes: { exclude: ['shippingAddressId', 'paymentMethodId', 'customerId'] },
		include: [
			{ 
				model: models.Address,
				as: 'shippingAddress',
				attributes: { exclude: ['stateId'] },
				where: (searchBillingAddress == null ? where.address : null),
				include: [{
					model: models.TaxRates,
					as: 'state',
					where: (searchBillingAddress == null ? where.state : null),
				}]
			}, {
				model: models.PaymentMethod,
				as: 'paymentMethod',
				include: [{
					model: models.Address,
					as: 'billingAddress',
					attributes: { exclude: ['stateId'] },
					where: (searchBillingAddress != null ? where.address : null),
					include: [{
						model: models.TaxRates,
						as: 'state',
						where: (searchBillingAddress != null ? where.state : null),
					}]
				}]
			}, {
				model: models.Customer,
				as: 'customer',
				where: where.customer,
				attributes: { exclude: ['password'] },
			}, {
				model: models.Item,
				as: 'items',
			}
		]
	}
}


module.exports = router;

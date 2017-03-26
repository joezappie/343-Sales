var express = require('express');
var router = express.Router();
var orders = require('./orders');

/* GET api info */
router.get('/', function(req, res, next) {
	var message = {
		to : "You",
		from : "Me",
		body : "I'm watching you."
	};
	res.json(message);
});

/* GET order information */
router.get('/order',function(req,res,next) {
	//var orderId = 10;
	//int : Id of the order
	var orderId = req.param('orderId');
	
	//bool : if the billing info should be returned
	var paymentInfo = req.param('paymentInfo');
	//bool : if the shipping info should be returned
	var shippingInfo = req.param('shippingInfo');
	//bool : if the customer info should be returned
	var customerInfo = req.param('customerInfo');
	//bool : if the list of items should be returned
	var items = req.param('items');
	
	orders(req,res,next,orderId,paymentInfo,shippingInfo,customerInfo,items);	
});

module.exports = router;

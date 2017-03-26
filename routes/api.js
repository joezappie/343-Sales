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
	//int : Id of the order
	var orderId = req.param('orderId');
	//bool : if the billing info should be returned
	var billingInfo = req.param('billingInfo');
	billingInfo = billingInfo == 'true';
	//bool : if the shipping info should be returned
	var shippingInfo = req.param('shippingInfo');
	shippingInfo = shippingInfo == 'true';
	//bool : if the customer info should be returned
	var customerInfo = req.param('customerInfo');
	customerInfo = customerInfo == 'true';
	//bool : if the list of items should be returned
	var items = req.param('items');	
	items = items == 'true';

	orders.get(req,res,next,orderId,billingInfo,shippingInfo,customerInfo,items);	
});

/* GET search for order */
router.get('/order/search',function(req,res,next){
	//String : Shipping address
	var address = req.param('address');
	//bool : False by default, True will search by billing
	var billingAddress = req.param('billingAddress');
	//bool : if the billing info should be returned
        var billingInfo = req.param('billingInfo');
        //bool : if the shipping info should be returned
        var shippingInfo = req.param('shippingInfo'); 
        //bool : if the customer info should be returned
        var customerInfo = req.param('customerInfo');
        //bool : if the list of items should be returned
        var items = req.param('items');
	
	orders.query(req,res,next,address,billingAddress,billingInfo,shippingInfo,customerInfo,shippingInfo,customerInfo,items);
});

module.exports = router;

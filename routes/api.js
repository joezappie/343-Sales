var express = require('express');
var customer = require('./customer');
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


router.get('/customer', function(req, res, next) {
	var firstName = req.param('firstName');
	var lastName = req.param('lastName');
	var email = req.param('email');
	var phone = req.param('phone');
	customer.get(req, res, next, firstName, lastName, email, phone);
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
	billingAddress = billingAddress == 'true';
	//int : Customer Id to help refine search. Optional
	var customerId = req.param('customerId');
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

	orders.query(req,res,next,address,billingAddress,customerId,billingInfo,shippingInfo,customerInfo,shippingInfo,customerInfo,items);

});

module.exports = router;

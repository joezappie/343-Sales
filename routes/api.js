var express = require('express');
var customer = require('./customer');
var Database = require('../database.js');
var router = express.Router();
var orders = require('./orders');

var db = new Database();

function updateResponse(err, rows, fields, res) {
	res.write("QUERY DONE!");
	res.write("\nROWS: ");
	res.write(JSON.stringify(rows));
	res.write("\nFIELDS: ");
	res.write(JSON.stringify(fields));
	res.end();
}

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

        if(orderId){
                orders.get(req,res,next,orderId,billingInfo,shippingInfo,customerInfo,items);
        }else{
                res.status(400).send('400 Bad request: orderId is needed');
        }
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


router.get('/customer', function(req, res, next) {
	var firstName = req.param('firstName');
	var lastName = req.param('lastName');
	var email = req.param('email');
	var phone = req.param('phone');
	customer.get(req, res, next, firstName, lastName, email, phone);
});

router.get('/dbtest', function(req, res, next) {
	db.query("SELECT * FROM Customer", updateResponse, res);
});

module.exports = router;

var express = require('express');
var router = express.Router();

var orders = {};

router.get('/', function(req,res,next){
	var orders = [];
	
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
	
	if (!orderId) {
		res.status(400).send('400 Bad request: orderId is needed');
	}
});

router.get('/search', function(req,res,next){
	var orders = [];
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
	
	database.forEach(function(data){
		var found = false;
		if(billingAddress == true && (address && address.length > 0)){
			var biObj = data['billingInfo'];
			var addressString = biObj['firstName']+' '+biObj['lastName']+' '+biObj['address']+' '+biObj['city']+' '+biObj['zip']+' '+biObj['state'];
			if(addressString.includes(address)){
				found = true;	
			}
		} else if(address && address.length > 0){
			var siObj = data['shippingInfo'];
			var addressString = siObj['firstName']+' '+siObj['lastName']+' '+siObj['address']+' '+siObj['city']+' '+siObj['zip']+' '+siObj['state'];
			if(addressString.includes(address)){
				found = true;
			}
		}

		if(found || (customerId && customerId.length > 0)){
			if(customerId && customerId.length > 0){
				if(data['customerId'] == customerId){
					var order = inflateResponseObject(data,billingInfo,shippingInfo,customerInfo,items);
					orders.push(order);
				}
			}else{
				var order = inflateResponseObject(data,billingInfo,shippingInfo,customerInfo,items);
				orders.push(order);
			}
		}
	});
	var responseObj = {
		"orders": orders
	};
	res.json(responseObj);
});

module.exports = router;

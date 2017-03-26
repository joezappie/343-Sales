var orders = function(req,res,next,orderId,paymentInfo,shippingInfo,customerInfo,items){
	var shippingInfoObj = {
		"firstName": "john",
		"lastName": "doe",
		"address": "1111 street",
		"zip": "14586",
		"state": "NY"
	};
	var billingInfoObj = {
		"firstName": "john",
		"lastName": "doe",
		"address": "1111 street",
		"zip": "14586",
		"state": "NY",
		"ccLastFourDigets": "1234"
	};
	var customerInfoObj = {	
		"customerId": 42,
		"firstName": "John",
		"lastName": "Johnson",
		"email": "nottheotherjohn@email.com",
		"phone": "5451112222"
	};
	var itemsAry = [
		{
			"serialId": 20,
			"price": 100,
			"status": "original|return|replace",
			"replaceDeadline": "2017-03-01T20:51:26.908Z",
			"refundDeadline": "2017-03-01T20:51:26.908Z"
		},
		{
			"serialId": 21,
			"price": 200,
			"status": "original|return|replace",
			"replaceDeadline": "2017-03-01T20:51:26.909Z",
			"refundDeadline": "2017-03-01T20:51:26.909Z"
		}
	];

	var orders = {
		orders : [
		{
			id : orderId,
			"customerId": 1,
			"repId": 99,
			"cost": 200,
			"orderDate": "2017-03-01T20:51:26.905Z",
			"isPaid": false,
			"taxPercentage": 8,
		}]	
	};

	if(paymentInfo){
		orders['orders'][0]['billingInfo'] = billingInfoObj;
	}
	if(shippingInfo){
		orders['orders'][0]['shippingInfo'] = shippingInfoObj;
	}
	if(customerInfo){
		orders['orders'][0]['customerInfo'] = customerInfoObj;
	}
	if(items){
		orders['orders'][0]['items'] = itemsAry; 
	}

	res.json(orders);
};

module.exports = orders;

var express = require('express');
var router = express.Router();

var models = require(__base + 'models.js');

// Mock database for orders
var db = [
	{
		"orderId" : 1,
		"serialId": 'A',
		"price": 100,
		"status": "original",
		"replaceDeadline": "2017-03-01T20:51:26.908Z",
		"refundDeadline": "2017-03-01T20:51:26.908Z"
	},
	{
		"orderId" : 1,
		"serialId": 'B',
		"price": 200,
		"status": "original",
		"replaceDeadline": "2017-03-01T20:51:26.909Z",
		"refundDeadline": "2017-03-01T20:51:26.909Z"
	},
	{
		"orderId" : 2,
		"serialId": 'C',
		"price": 200.25,
		"status": "original",
		"replaceDeadline": "2017-04-20T20:51:26.908Z",
		"refundDeadline": "2017-05-20T20:51:26.908Z"
	},
	{
		"orderId" : 2,
		"serialId": 'D',
		"price": 500.25,
		"status": "original",
		"replaceDeadline": "2017-04-20T20:51:26.909Z",
		"refundDeadline": "2017-05-20T20:51:26.909Z"
	},
	{
		"orderId" : 3,
		"serialId": 'E',
		"price": 100,
		"status": "original",
		"replaceDeadline": "2017-04-22T20:51:26.908Z",
		"refundDeadline": "2017-05-22T20:51:26.908Z"
	}
]

// POST order return
function callbackhandler(err, results) {
	if (err) {
		console.log("there was an error");
	} else {
		console.log("no error");
	}
}

router.post('/', function(req, res, next) {
	var replace, orderId, serialIds;

	replace = req.body.replace;
	orderId = req.body.orderId;
	serialIds = req.body.serialIds;

	if (replace === null || replace === undefined || !orderId || !serialIds || serialIds.length < 1) {
		res.status("400").json({ error: "Missing required parameters" });
	}

	var refundValue = replace === 'true' || replace === true ? 0 : 1;

	models.Item.update({ refunded: refundValue }, { where: { serialNumber: serialIds }})
		.spread(function(affectedCount, affectedRows) {
			return models.Item.findAll({ where: { serialNumber: serialIds }})
				.then(function(items) {
					var responseItems = items.map(function(orderItem) {
						var item = orderItem.dataValues;
						var status = item.refunded === null || item.refunded === undefined ? 'original' : 'return';
						return {
							serialId: item.serialNumber,
							price: item.price,
							replaceDeadline: item.replacementDeadline,
							refundDeadline: item.refundDeadline,
							modelId: item.modelId,
							bogoSerialNumber: item.bogoSerialNumber,
							status: item.refunded === 1 ? status : 'replace'
						};
					});

					return res.status(200).json({ orderId: orderId, items: responseItems });
				});
		});
});

module.exports = router;

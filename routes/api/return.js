var express = require('express');

var router = express.Router();

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

	if (replace === null || replace === undefined || !orderId || !serialIds) {
		res.status("400").send("Missing required parameters");
	}

	var dbcalls = [];

	/*
	if (replace == 'true') {
		serialIds.forEach(function(item, index) {
			dbcalls.push(function(callback) {
				db.query("INSERT INTO Item (orderId, serialNumber, modelId, price, status, replacementDeadline, refundDeadline) VALUES (" + orderId + ", '" + item + "', 2, 10, 'Replacement', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)", function(err, rows, fields, res) {
					if (err) console.log("Failed to submit query for serialId: " + item);
					callback(err);
				});
			});
		});
	}

	async.series(dbcalls, function(err) {
		db.query("SELECT * FROM Item", function(err, rows) {
			console.log("test");
			console.log(rows);
			res.json(rows);
		});
	});*/
	serialIds.forEach(function(item, index) {
		var found = false;
		db.forEach(function(dbitem, dbindex) {
			if (!found) {
				if (dbitem['serialId'] == item && dbitem['status'] != "Returned") {
					found = true;
					if (replace == 'true') {
						db.push({
							"orderId" : dbitem['orderId'],
							"serialId": item,
							"price": dbitem['price'],
							"status": "Replacement",
							"replaceDeadline": dbitem['replaceDeadline'],
							"refundDeadline": dbitem['refundDeadline']
						});
					} else {
						dbitem['status'] = "Returned";
					}
				}
			}
		});
		if (!found) {
			res.status("400").send("Invalid serialId: " + item);
		}
	});

	res.json(db);

});

module.exports = router;

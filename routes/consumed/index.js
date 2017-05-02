var express = require('express');
var request = require('request');
var router = express.Router();

/* URLs for consumed APIs */
var INVENTORY_BASE_URL = "http://vm343b.se.rit.edu:5000/";
var ACCOUNTING_BASE_URL = "http://vm343e.se.rit.edu/";

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/index');
});

router.get('/salesRep', function(req, res, next) {
	res.render('pages/salesRep');
});

/* Load the URL and then display its contents or show an error */
function loadJSON(url, res) {
	request(url, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			res.send(body);
		} else {
			res.send(error);
		}
	});
}

function postJSON(url, json, res) {
	var options = {
	  uri: url,
	  method: 'POST',
	  json: json
	};

	request(options, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			res.send(body);
		} else {
			res.send(error);
		}
	});
}

/* Load all the phones in inventory */
router.get('/inventory', function(req, res, next) {
	loadJSON(INVENTORY_BASE_URL + "inventory", res);
});

/* Load phone models. Use ?model GET param to load specific model else it will get all */
router.get('/inventory/models', function(req, res, next) {
	var model = "all";
	if (req.params.model) {
		model = req.params.model;
	}
	loadJSON(INVENTORY_BASE_URL + "inventory/models/" + model, res);
});


/* Load a specific phone by serial */
router.get('/inventory/phones/serial', function(req, res, next) {
	loadJSON(INVENTORY_BASE_URL + "/inventory/phones/" + req.params.serial, res);
});

/* Return a phone */
router.get('/inventory/phones/return', function(req, res, next) {
	loadJSON(INVENTORY_BASE_URL + "/inventory/phone/return?phoneid=" + req.params.phoneid, res);
});

/* Return a phone */
router.get('/accounting/sale', function(req, res, next) {
	var json = {
		preTaxAmount: 100.00,
		taxAmount: 1.50,
		transactionType: "Deposit",
		salesID: 1
	};

	res.write("POST DATA: " + JSON.stringify(json));

	postJSON(ACCOUNTING_BASE_URL + "/ui/sale", json, res);
});


module.exports = router;

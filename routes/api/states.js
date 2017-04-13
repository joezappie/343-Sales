var models = require(__base + 'models.js');
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

	models.TaxRates.findAll().then(function(results) {
		res.json(results);
	});
});

module.exports = router;

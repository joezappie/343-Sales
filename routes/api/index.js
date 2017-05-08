var models = require(__base + 'models.js');
var express = require('express');
var Sequelize = require('sequelize');
var helpers = require(__base + 'helpers.js');
var router = express.Router();

// Route requires
router.use('/customer', require('./customer'));
router.use('/order', require('./order'));
router.use('/return', require('./return'));
router.use('/states', require('./states'));

/* GET api info */
router.get('/', function(req, res, next) {
	var message = {
		to : "You",
		from : "Me",
		body : "I'm watching you."
	};
	res.json(message);
});

router.get('/shippingOptions', function(req, res, next) {
	models.ShippingCosts.findAll({}).then(function(result) {
		res.json(result);
	}).catch(function(err) {
		res.json(err);
	});
});


module.exports = router;

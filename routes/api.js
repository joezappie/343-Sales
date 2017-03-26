var express = require('express');
var customer = require('./customer');
var router = express.Router();

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
	customer(req, res, next);
});

module.exports = router;

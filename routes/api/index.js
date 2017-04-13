var express = require('express');
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

module.exports = router;

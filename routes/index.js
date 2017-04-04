var express = require('express');
var router = express.Router();

// Route requires
router.use('/api', require('./api'));
router.use('/consumed', require('./consumed'));

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/index');
});

router.get('/apiTest', function(req, res) {
	res.render('pages/apiTest');
});

router.get('/salesRep', function(req, res) {
	res.render('pages/salesRep');
});

module.exports = router;

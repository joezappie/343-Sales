var express = require('express');
var router = express.Router();

// Route requires
router.use('/api', require('./api'));

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('pages/index');
});

module.exports = router;

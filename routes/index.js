var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var stuff = {
		var1: "this is the first var",
		var2: "here is another var"
	};
	res.json('index', { title: 'Express' });
});

module.exports = router;

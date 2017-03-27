var express = require('express');
var Database = require(__base + '/database.js');
var router = express.Router();

var db = new Database();

// Route requires
router.use('/customer', require('./customers'));
router.use('/order', require('./orders'));

function updateResponse(err, rows, fields, res) {
	res.write("QUERY DONE!");
	res.write("\nROWS: ");
	res.write(JSON.stringify(rows));
	res.write("\nFIELDS: ");
	res.write(JSON.stringify(fields));
	res.end();
}

/* GET api info */
router.get('/', function(req, res, next) {
	var message = {
		to : "You",
		from : "Me",
		body : "I'm watching you."
	};
	res.json(message);
});




router.get('/dbtest', function(req, res, next) {
	db.query("SELECT * FROM Customer", updateResponse, res);
});

module.exports = router;

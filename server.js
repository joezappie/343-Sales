// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = require('path');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the base directory for use with requires
global.__base = __dirname + '/';

// set the view engine to ejs
app.set('view engine', 'ejs');

var port = process.env.PORT || 8080;        // set our port to 8080

// ROUTE SETUP
// =============================================================================
app.use(require('./routes'));
console.log(__dirname);
app.use('/assets', express.static(path.resolve(__dirname + '/static/')));

// ERROR HANDLING
// =============================================================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('pages/error', {
		message : err.message,
		status : err.status
	});
});

// START THE SERVER
// =============================================================================
console.log('Starting sales server on port ' + port);
module.exports = app;

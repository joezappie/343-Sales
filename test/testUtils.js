var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

// var mock = require('mock-require');

// var dbTest = require("../databaseTest.js");

// var mockDB = function() {
// 	console.log('mock dbbbb');
// 	console.log(dbTest);
// 	/***************************************
// 	 * CREATE THE DATABASE
// 	 **************************************/
// 	dbTest.sync({ force: true });
// 	mock('db', dbTest);
//
// 	var server = require('../server.js');
// 	return server;
//
// 	// require('../generateData.js');
// };

/**
 * Verify the given object has the correct properties and property types
 *
 * obj - the given object
 * properties - dictionary mapping property names to property types
 */
var verifyProperties = function(obj, properties) {
	Object.keys(properties).forEach(function(propertyName) {
		var propertyType = properties[propertyName];

		obj.should.have.property(propertyName);
		obj[propertyName].should.be.a(propertyType);
	});
};

module.exports = {
	verifyProperties,
};

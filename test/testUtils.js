var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

var models = require(__base + 'models.js');

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

var createCustomers = function() {
	var customers = [];

	var customer1 = {
		"password": "",
		"phoneNumber": '508-555-5555',
		"email": 'person@verizon.com',
		"company": 'Verizon',
		"firstName": 'Hello',
		"lastName": 'Kitty'
	};

	return models.Customer.create(customer1).then(function(customer) {
		var customer2 = {
			"password": "",
			"phoneNumber": '508-555-5555',
			"email": 'mickey@gmail.com',
			"company": null,
			"firstName": 'Mickey',
			"lastName": 'Mouse'
		};

		return models.Customer.create(customer2);
	});
};

module.exports = {
	verifyProperties,
	createCustomers
};

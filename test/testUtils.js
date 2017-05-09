var chai = require('chai');

var expect = chai.expect;
var should = chai.should();

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

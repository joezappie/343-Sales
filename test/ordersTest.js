process.env.NODE_ENV = 'test';

var chai = require('chai');

var expect = chai.expect;

describe('Orders', function() {
	describe('/GET Orders', function() {
		it('should be a passing test', function() {
			var test = 'Hello world';
			expect(test).to.be.a('string');
		});
	});
});

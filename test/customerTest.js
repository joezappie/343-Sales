process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var models = require(__base + 'models.js');
var testUtils = require('./testUtils');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Customers', function() {

	// create two customers for testing
	before(function(done) {
		testUtils.createCustomers().then(function() {
			done();
		});
	});

	describe('GET /customer', function() {
		it('should return the correct customers searched by firstName', function(done) {
			var testName = 'Hello';

			chai.request(server)
				.get('/api/customer')
				.query({ firstName: testName })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;

					var customers = response.body;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						testUtils.verifyProperties(customer, {
							id: 'number',
							firstName: 'string',
							lastName: 'string',
							email: 'string',
							phoneNumber: 'string',
							company: 'string'
						});

						expect(customer.firstName).to.equal(testName);
						expect(customer.company).to.equal('Verizon');
					});

					done();
				});
		});

		it('should return the correct customers searched by lastName', function(done) {
			var testName = 'Mouse';

			chai.request(server)
				.get('/api/customer')
				.query({ lastName: testName })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;

					var customers = response.body;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						expect(customer.lastName).to.equal(testName);
						expect(customer.company).to.equal(null);
					});

					done();
				});
		});

		it('should return the correct customers searched by email', function(done) {
			var testEmail = 'mickey@gmail.com';

			chai.request(server)
				.get('/api/customer')
				.query({ email: testEmail })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;

					var customers = response.body;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						expect(customer.email).to.equal(testEmail);
					});

					done();
				});
		});

		it('should return the correct customers searched by phone number', function(done) {
			var testPhoneNum = '508-555-5555';

			chai.request(server)
				.get('/api/customer')
				.query({ phoneNumber: testPhoneNum })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;

					var customers = response.body;
					customers.should.be.a('array');
					expect(customers.length).to.equal(2);

					customers.forEach(function(customer) {
						expect(customer.phoneNumber).to.equal(testPhoneNum);
					});

					done();
				});
		});
	});
});

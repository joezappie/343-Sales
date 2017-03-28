process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var testUtils = require('./testUtils');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Customers', function() {
	describe('GET /customer', function() {
		it('should return the correct customers searched by firstName', function(done) {
			var testName = 'John';

			chai.request(server)
				.get('/api/customer')
				.query({ firstName: testName })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.have.property('customers');

					var customers = response.body.customers;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						testUtils.verifyProperties(customer, {
							customerId: 'number',
							firstName: 'string',
							lastName: 'string',
							email: 'string',
							phone: 'string'
						});

						expect(customer.firstName).to.equal(testName);
					});

					done();
				});
		});

		it('should return the correct customers searched by lastName', function(done) {
			var testName = 'doe';

			chai.request(server)
				.get('/api/customer')
				.query({ lastName: testName })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.have.property('customers');

					var customers = response.body.customers;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						expect(customer.lastName).to.equal(testName);
					});

					done();
				});
		});

		it('should return the correct customers searched by email', function(done) {
			var testEmail = 'therealjoe@joemail.com';

			chai.request(server)
				.get('/api/customer')
				.query({ email: testEmail })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.have.property('customers');

					var customers = response.body.customers;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						expect(customer.email).to.equal(testEmail);
					});

					done();
				});
		});

		it('should return the correct customers searched by phone number', function(done) {
			var testPhoneNum = '1231231234';

			chai.request(server)
				.get('/api/customer')
				.query({ phone: testPhoneNum })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.have.property('customers');

					var customers = response.body.customers;
					customers.should.be.a('array');

					customers.forEach(function(customer) {
						expect(customer.phone).to.equal(testPhoneNum);
					});

					done();
				});
		});
	});
});

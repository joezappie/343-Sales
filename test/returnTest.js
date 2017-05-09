process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var testUtils = require('./testUtils');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Return', function() {
	describe('POST /return', function() {
		it('should successfully process a return', function(done) {
			chai.request(server)
				.post('/api/return')
				.send({ replace: false, orderId: 1, serialIds: [120133] })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;

					if (response.body.orderId) {
						expect(response.body.orderId).to.equal(1);
						response.body.should.have.property('items');

						var items = response.body.items;
						items.should.be.a('array');

						items.forEach(function(item) {
							testUtils.verifyProperties(item, {
								serialId: 'number',
								price: 'number',
								status: 'string',
								replaceDeadline: 'string',
								refundDeadline: 'string',
								modelId: 'string'
							});
						});
					}

					done();
				});
		});

		it('should return 400 if required params are not provided', function(done) {
			chai.request(server)
				.post('/api/return')
				.end(function(error, response) {
					response.should.have.status(400);
					done();
				});
		});
	});
});

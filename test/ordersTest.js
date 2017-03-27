process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var testUtils = require('./testUtils');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

describe('Orders', function() {
	describe('GET /order', function() {
		it('should return 400 error for not providing orderId', function(done) {
			chai.request(server)
				.get('/api/order')
				.end(function(error, response) {
					response.should.have.status(400);
					done();
				});
		});

		it('should return the correct order given an orderId', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1 })
				.end(function(error, response) {
					response.should.have.status(200);
					response.should.be.json;
					response.body.should.have.property('orders');

					var orders = response.body.orders;
					orders.should.be.a('array');
					expect(orders).to.have.lengthOf(1);
					expect(orders[0].id).to.equal(1);

					var order = orders[0];

					testUtils.verifyProperties(order, {
						customerId: 'number',
						repId: 'number',
						cost: 'number',
						orderDate: 'string',
						isPaid: 'boolean',
						taxPercentage: 'number'
					});

					order.should.not.have.property('billingInfo');
					order.should.not.have.property('shippingInfo');
					order.should.not.have.property('customerInfo');
					order.should.not.have.property('items');

					done();
				});
		});

		it('should return the correct order with billing info', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1, billingInfo: true })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body.orders;
					orders.should.be.a('array');
					expect(orders).to.have.lengthOf(1);
					expect(orders[0].id).to.equal(1);

					var order = orders[0];

					order.should.have.property('billingInfo');
					testUtils.verifyProperties(order.billingInfo, {
						firstName: 'string',
						lastName: 'string',
						address: 'string',
						city: 'string',
						zip: 'string',
						state: 'string',
						ccLastFourDigits: 'string'
					});

					done();
				});
		});

		it('should return the correct order with customer info', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1, customerInfo: true })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body.orders;
					orders.should.be.a('array');
					expect(orders).to.have.lengthOf(1);
					expect(orders[0].id).to.equal(1);

					var order = orders[0];

					order.should.have.property('customerInfo');
					testUtils.verifyProperties(order.customerInfo, {
						customerId: 'number',
						firstName: 'string',
						lastName: 'string',
						email: 'string',
						phone: 'string'
					});

					done();
				});
		});

		it('should return the correct order with shipping info', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1, shippingInfo: true })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body.orders;
					orders.should.be.a('array');
					expect(orders).to.have.lengthOf(1);
					expect(orders[0].id).to.equal(1);

					var order = orders[0];

					order.should.have.property('shippingInfo');
					testUtils.verifyProperties(order.shippingInfo, {
						firstName: 'string',
						lastName: 'string',
						address: 'string',
						city: 'string',
						zip: 'string',
						state: 'string'
					});

					done();
				});
		});

		it('should return the correct order with items', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1, items: true })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body.orders;
					orders.should.be.a('array');
					expect(orders).to.have.lengthOf(1);
					expect(orders[0].id).to.equal(1);

					var order = orders[0];

					order.should.have.property('items');
					order.items.should.be.a('array');

					order.items.forEach(function(item) {
						testUtils.verifyProperties(item, {
							serialId: 'number',
							price: 'number',
							status: 'string',
							replaceDeadline: 'string',
							refundDeadline: 'string'
						});
					});

					done();
				});
		});
	});

	describe('GET /order/search', function() {
		it('should return orders with the given customerId', function(done) {
			chai.request(server)
				.get('/api/order/search')
				.query({ customerId: 1 })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body.orders;
					orders.should.be.a('array');

					orders.forEach(function(order) {
						expect(order.customerId).to.equal(1);
					});

					done();
				});
		});

		it('should return orders with the given shipping address', function(done) {
			var testAddress = 'john doe 1111 street Rochester NY 14568';

			chai.request(server)
				.get('/api/order/search')
				.query({ address: testAddress, shippingInfo: true })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body.orders;
					orders.should.be.a('array');

					orders.forEach(function(order) {
						var shippingInfo = order.shippingInfo;
						expect(testAddress).to.contain(shippingInfo.firstName);
						expect(testAddress).to.contain(shippingInfo.lastName);
						expect(testAddress).to.contain(shippingInfo.address);
						expect(testAddress).to.contain(shippingInfo.city);
						expect(testAddress).to.contain(shippingInfo.state);
						expect(testAddress).to.contain(shippingInfo.zip);
					});

					done();
				});
		});
	});

	it('should return orders with the given billing address', function(done) {
		var testAddress = 'john doe 1111 street Rochester NY 14568';

		chai.request(server)
			.get('/api/order/search')
			.query({ billingAddress: testAddress, billingInfo: true })
			.end(function(error, response) {
				response.should.have.status(200);

				var orders = response.body.orders;
				orders.should.be.a('array');

				orders.forEach(function(order) {
					var billingInfo = order.billingInfo;
					expect(testAddress).to.contain(billingInfo.firstName);
					expect(testAddress).to.contain(billingInfo.lastName);
					expect(testAddress).to.contain(billingInfo.address);
					expect(testAddress).to.contain(billingInfo.city);
					expect(testAddress).to.contain(billingInfo.state);
					expect(testAddress).to.contain(billingInfo.zip);
				});

				done();
			});
	});
});

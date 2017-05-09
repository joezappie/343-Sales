process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var models = require(__base + 'models.js');
var testUtils = require('./testUtils');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

var testOrder;

describe('Orders', function() {
	before(function(done) {
		models.Orders.findById(1).then(function(order) {
			testOrder = order.dataValues;
			done();
		});
	});

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

					var order = response.body;
					order.should.be.a('object');
					expect(order.id).to.equal(1);

					testUtils.verifyProperties(order, {
						id: 'number',
						totalItemCost: 'number',
						shippingCost: 'number',
						orderDate: 'string',
						isPaid: 'boolean',
						taxPercentage: 'number',
						shippingAddress: 'object',
						paymentMethod: 'object',
						customer: 'object',
						items: 'array'
					});

					done();
				});
		});

		it('should return the correct order with payment info', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1 })
				.end(function(error, response) {
					response.should.have.status(200);

					var order = response.body;
					order.should.be.a('object');
					expect(order.id).to.equal(1);

					order.should.have.property('paymentMethod');

					testUtils.verifyProperties(order.paymentMethod, {
						id: 'number',
						CVC: 'string',
						expirationDate: 'string',
						billingAddressId: 'number',
						cardNumber: 'string'
					});

					testUtils.verifyProperties(order.paymentMethod.billingAddress, {
						id: 'number',
						customerId: 'number',
						firstName: 'string',
						lastName: 'string',
						address: 'string',
						city: 'string',
						zip: 'string',
						state: 'object'
					});

					done();
				});
		});

		it('should return the correct order with customer info', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1 })
				.end(function(error, response) {
					response.should.have.status(200);

					var order = response.body;
					order.should.be.a('object');
					expect(order.id).to.equal(1);

					order.should.have.property('customer');
					testUtils.verifyProperties(order.customer, {
						id: 'number',
						firstName: 'string',
						lastName: 'string',
						email: 'string',
						phoneNumber: 'string'
					});

					testCustomerId = order.customer.id;

					done();
				});
		});

		it('should return the correct order with shipping address', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1, shippingInfo: 'true' })
				.end(function(error, response) {
					response.should.have.status(200);

					var order = response.body;
					order.should.be.a('object');
					expect(order.id).to.equal(1);

					order.should.have.property('shippingAddress');
					testUtils.verifyProperties(order.shippingAddress, {
						id: 'number',
						customerId: 'number',
						firstName: 'string',
						lastName: 'string',
						address: 'string',
						city: 'string',
						zip: 'string',
						state: 'object'
					});

					done();
				});
		});

		it('should return the correct order with items', function(done) {
			chai.request(server)
				.get('/api/order')
				.query({ orderId: 1, items: 'true' })
				.end(function(error, response) {
					response.should.have.status(200);

					var order = response.body;
					order.should.be.a('object');
					expect(order.id).to.equal(1);

					order.should.have.property('items');
					order.items.should.be.a('array');

					order.items.forEach(function(item) {
						testUtils.verifyProperties(item, {
							id: 'number',
							serialNumber: 'number',
							orderId: 'number',
							modelId: 'string',
							price: 'number',
							replacementDeadline: 'string',
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
				.query({ customerId: testOrder.customerId })
				.end(function(error, response) {
					response.should.have.status(200);

					var orders = response.body;
					orders.should.be.a('array');

					orders.forEach(function(order) {
						expect(order.customer.id).to.equal(testOrder.customerId);
					});

					done();
				});
		});

		it('should return orders with the given shipping address zipcode', function(done) {
			models.Address.findById(testOrder.shippingAddressId).then(function(shippingAddress) {
				chai.request(server)
					.get('/api/order/search')
					.query({ zipCode: shippingAddress.zip, billingAddress: null })
					.end(function(error, response) {
						response.should.have.status(200);

						var orders = response.body;
						orders.should.be.a('array');

						orders.forEach(function(order) {
							expect(order.shippingAddress.zip).to.equal(shippingAddress.zip);
						});

						done();
					});
			});
		});

		it('should return orders with the given billing address zipcode', function(done) {
			models.PaymentMethod.findById(testOrder.paymentMethodId).then(function(paymentMethod) {
				models.Address.findById(paymentMethod.billingAddressId).then(function(billingAddress) {
					chai.request(server)
						.get('/api/order/search')
						.query({ address: billingAddress.zip, billingAddress: 'true' })
						.end(function(error, response) {
							response.should.have.status(200);

							var orders = response.body;
							orders.should.be.a('array');

							orders.forEach(function(order) {
								var returnedAddress = order.paymentMethod.billingAddress;
								expect(returnedAddress.zip).to.equal(billingAddress.zip);
							});

							done();
						});
					});
				});
		});
	});
});

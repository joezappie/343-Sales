db = require("./database.js");

var models = {};

/***************************************
 * LOAD ALL THE MODELS
 **************************************/
models.Address = require("./models/address.js");
models.Customer = require("./models/customer.js");
models.Orders = require("./models/orders.js");
models.Item = require("./models/orderitem.js");
models.PaymentMethod = require("./models/paymentmethod.js");
models.ReturnPolicy = require("./models/returnpolicy.js");
models.ShippingCosts = require("./models/shippingcosts.js");
models.TaxRates = require("./models/taxrates.js");

/***************************************
 * SETUP RELATIONS
 **************************************/
// Address Relations
models.Address.belongsTo(models.Customer, { as: 'customer', onDelete: 'CASCADE', foreignKey: { name: 'customerId', allowNull: false }});
models.Address.belongsTo(models.TaxRates, { as: 'state', onDelete: 'CASCADE', foreignKey: { name: 'stateId', allowNull: false }});

models.Customer.hasMany(models.Address, { as: 'shippingAddress', foreignKey: 'customerId' });
models.Customer.hasMany(models.Address, { as: 'billingAddress', foreignKey: 'customerId' });

// Orders Relations
models.Orders.belongsTo(models.Customer, { as: 'customer', onDelete: 'CASCADE', foreignKey: { name: 'customerId', allowNull: false }});
models.Orders.belongsTo(models.Address, { as: 'shippingAddress', onDelete: 'CASCADE', foreignKey: { name: 'shippingAddressId', allowNull: false }});
models.Orders.belongsTo(models.PaymentMethod, { as: 'paymentMethod', onDelete: 'CASCADE', foreignKey: { name: 'paymentMethodId', allowNull: false }});
models.Item.belongsTo(models.Orders, { as: 'order', onDelete: 'CASCADE', foreignKey: { name: 'orderId', allowNull: false }});
models.Orders.hasMany(models.Item, { as: 'items', foreignKey: 'orderId' });

// Payment Method Relations
models.PaymentMethod.belongsTo(models.Address, { as: 'billingAddress', onDelete: 'CASCADE', foreignKey: { name: 'billingAddressId', allowNull: false }})

module.exports = models;

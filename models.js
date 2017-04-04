db = require("./database.js");

var models = {};

/***************************************
 * LOAD ALL THE MODELS
 **************************************/
models.Address = require("./models/address.js");
models.Customer = require("./models/customer.js");
models.Order = require("./models/orders.js");
models.OrderItem = require("./models/orderitem.js");
models.PaymentMethod = require("./models/paymentmethod.js");
models.ReturnPolicy = require("./models/returnpolicy.js");
models.ShippingCosts = require("./models/shippingcosts.js");
models.TaxRates = require("./models/taxrates.js");

/***************************************
 * SETUP RELATIONS
 **************************************/
// Address Relations
models.Address.belongsTo(models.Customer, { foreignKey: { name: 'customerId', allowNull: false }});
models.Address.belongsTo(models.TaxRates, { foreignKey: { name: 'stateId', allowNull: false }});

// Orders Relations
models.Order.belongsTo(models.Customer, { foreignKey: { name: 'customerId', allowNull: false }});
models.Order.belongsTo(models.Address, { foreignKey: { name: 'shippingAddressId', allowNull: false }});
models.Order.belongsTo(models.PaymentMethod, { foreignKey: { name: 'paymentMethodId', allowNull: false }});
models.OrderItem.belongsTo(models.Order, { foreignKey: { name: 'orderId', allowNull: false }});

// Payment Method Relations
models.PaymentMethod.belongsTo(models.Address, { foreignKey: { name: 'billingAddressId', allowNull: false }})

module.exports = models;
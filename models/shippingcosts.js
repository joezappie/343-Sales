var Sequelize = require('sequelize');
var db = require("../database.js");

// Shipping Costs Definition
module.exports = db.define('shippingCosts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { type: Sequelize.STRING(25), allowNull: false},
	price: { type: Sequelize.DECIMAL(10,2), allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'ShippingCosts'});
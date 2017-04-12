var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    repId: { type: Sequelize.INTEGER },
    totalItemCost: { type: Sequelize.DECIMAL(10,2), allowNull: false},
	shippingCost: { type: Sequelize.DECIMAL(10,2), allowNull: false},
	orderDate: { type: Sequelize.DATE, allowNull: false},
	isPaid: { type: Sequelize.BOOLEAN, allowNull: false},
	taxPercentage: { type: Sequelize.DECIMAL(10,4), allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'Orders'});
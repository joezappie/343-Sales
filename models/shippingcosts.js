var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
Customer = db.define('shippingCosts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: { type: Sequelize.STRING(25), allowNull: false},
	price: { type: Sequelize.DECIMAL(10,2), allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'ShippingCosts'});
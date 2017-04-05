var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('paymentMethod', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cardNumber: { type: Sequelize.STRING(25), allowNull: false},
	CVC: { type: Sequelize.INTEGER, allowNull: false},
	expirationDate: { type: Sequelize.DATE, allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'PaymentMethod'});
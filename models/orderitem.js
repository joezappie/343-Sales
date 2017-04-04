var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    serialNumber: { type: Sequelize.STRING(32), allowNull: false},
	modelId: { type: Sequelize.INTEGER, allowNull: false},
	price: { type: Sequelize.DECIMAL(10,2), allowNull: false},
	replacementDeadline: { type: Sequelize.DATE, allowNull: false},
	refundDeadline: { type: Sequelize.DATE, allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'OrderItem'});
var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('customer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: { type: Sequelize.STRING, allowNull: false},
    lastName: { type: Sequelize.STRING, allowNull: false},
    email: { type: Sequelize.STRING, allowNull: false},
    password: { type: Sequelize.STRING(32), allowNull: false},
    phoneNumber:  { type: Sequelize.STRING(20), allowNull: false},
	isCompany: {type: Sequelize.BOOLEAN, allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'Customer'});
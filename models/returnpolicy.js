var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('returnPolicy', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: { type: Sequelize.STRING(25), allowNull: false},
	numberOfDays: { type: Sequelize.INTEGER, allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'ReturnPolicy'});
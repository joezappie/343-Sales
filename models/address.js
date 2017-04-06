var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('address', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: { type: Sequelize.STRING, allowNull: false},
    lastName: { type: Sequelize.STRING, allowNull: false},
    city: { type: Sequelize.STRING, allowNull: false},
    address: { type: Sequelize.STRING(256), allowNull: false},
	zip: { type: Sequelize.STRING(10), allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'Address'});
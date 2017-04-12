var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('taxRates', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    state: { type: Sequelize.STRING(32), allowNull: false},
    rate: { type: Sequelize.DECIMAL(10,4), allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'TaxRates'});

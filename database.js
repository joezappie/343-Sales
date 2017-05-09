var config = require("./config.json");
var Sequelize = require('sequelize');

config.storage = process.env.NODE_ENV === 'test' ? './salesTest.sql' : config.storage;

module.exports = new Sequelize(config.database, config.user, config.password, config);

var config = require("./config.json");
var Sequelize = require('sequelize');
module.exports = new Sequelize(config.database, config.user, config.password, config);
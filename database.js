var databaseConfig = require("./config.json");
var Sequelize = require('sequelize');
module.exports = new Sequelize(databaseConfig.database, databaseConfig.user, databaseConfig.password, {
    host: databaseConfig.host,
    dialect: databaseConfig.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
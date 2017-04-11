const util = require('util');

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
}, {timestamps: false, freezeTableName: true, tableName: 'Address',
  instanceMethods : {
    getPrettyAddress : function (){
      return util.format("%s, %s, %s", this.address, this.city, this.zip);
    }
  }
});

var Address = require("./address.js");

var test = Address.build({
  "firstName": "john",
  "lastName": "doe",
  "address": "1111 street",
  "city": "Rochester",
  "zip": "14586",
  "state": "NY"
});

console.log(test.getPrettyAddress());

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
  },
  //Start class settings
  {timestamps: false, freezeTableName: true, tableName: 'Customer',

  //Instance methods are technically part of the class settings,
  //so don't lost track of your brackets or commas.
  //A method name maps to a define function.
  instanceMethods : {
    getFullname : function () {
      return [this.firstName, this.lastName].join(' ');
    }
  },

  //Here's an example of a class method. This cannot be called
  //on instances of the customer method.
  classMethods : {
    test : function (){
      return "test";
    }
  }
});

var CustomerClass = require("./customer.js");

var customerInstance = CustomerClass.build(
  {
    id : 6,
    firstName : "Jeff",
    lastName : "Bridges",
    email : "test@gmail.com",
    password : "password",
    phoneNumber : "555 234 4534",
    isCompany : false
  }
);

console.log(JSON.stringify(customerInstance.getFullname()));
console.log(JSON.stringify(CustomerClass.test()));

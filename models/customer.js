var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('customer', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: { type: Sequelize.STRING, allowNull: false},
    password: { 
		type: Sequelize.STRING(32), 
		allowNull: false,
		get: function()  {
			return null;
		},
	},
    phoneNumber:  { type: Sequelize.STRING(20), allowNull: false},
    company: {type: Sequelize.STRING(50) },
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
});

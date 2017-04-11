var Sequelize = require('sequelize');
var db = require("../database.js");

// Customer Definition
module.exports = db.define('paymentMethod', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardNumber: { type: Sequelize.STRING(25), allowNull: false},
  CVC: { type: Sequelize.INTEGER, allowNull: false},
  expirationDate: { type: Sequelize.DATE, allowNull: false},
}, {timestamps: false, freezeTableName: true, tableName: 'PaymentMethod',
  instanceMethods : {
    //Helper method for isExpired
    isDateValid : function() {
      if (Object.prototype.toString.call(this.expirationDate) === "[object Date]"
          && !isNaN(this.expirationDate.getTime()))
        return true;
      else
        return false;
    },

    isExpired : function() {
      if (this.isDateValid())
        return new Date().getTime() >= this.expirationDate.getTime();
      else
        return true;
    }
  }
});

var PaymentMethod = require("./paymentmethod.js");

var test = PaymentMethod.build({
  cardNumber : "1122 1222 1222 1222",
  CVC : 300,
  expirationDate : "2016-09-01T00:00:00.000Z"
});

console.log(test.isExpired());

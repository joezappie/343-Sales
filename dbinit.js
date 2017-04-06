var models = require("./models.js");
var db = require("./database.js");

/***************************************
 * CREATE THE DATABASE
 **************************************/
db.sync({ force: true });
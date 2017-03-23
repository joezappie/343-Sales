var customer = function(req, res, next) {

  var firstName = req.param('FirstName');
  var lastName = req.param('LastName');
  var email = req.param('Email');
  var phoneNumber = req.param('PhoneNumber');
  var customerId = req.param('CustomerId');

  res.json({customers : [{customerId:customerId}]});
};

module.exports = customer;

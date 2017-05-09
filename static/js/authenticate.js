var onSignout = function() {
	localStorage.removeItem('token');
};

var showUnauthenticated = function() {
	var message = '<span>Sorry, you are not logged in as a Sales Rep. Please go ';
	var oauthLink = '<a href="http://vm343a.se.rit.edu/oauth" target="_blank">here</a> to log in</span>';
	var $toastContent = $(message + oauthLink);
	Materialize.toast($toastContent, 6000);
};

var authenticateToken = function(page, handleError) {
	var token = localStorage.getItem('token');

	if (!token) {
		handleError();
	} else {
		$.ajax({
			type: 'GET',
			url: 'http://vm343a.se.rit.edu/confirm_login/Sales/' + token,
			success: function() {
				if (page !== null) {
					window.location.href = page;
				}
			},
			error: handleError
		});
	}
};

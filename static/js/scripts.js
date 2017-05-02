$(document).ready(function() {
	console.log('ready');
	$('select').material_select();
});

function showErrorMessages(errors) {
	$(errors).forEach(function(msg, input) {
		$("#"+input).addClass("invalid");
		console.log(msg + " " + input);
	});
}

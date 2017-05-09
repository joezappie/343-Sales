var phoneModels = {};
var selectedQtys = {};

$(document).ready(function() {
	$('select').material_select();

	var token = getParameterByName('token');
	if (token) {
		localStorage.setItem('token', token);
	}

	var unauthenticated = getParameterByName('unauthenticated');
	if (unauthenticated) {
		showUnauthenticated();
	}

	var phones = JSON.parse(localStorage.getItem('phones'));

	$.get('/consumed/inventory/models', function(data) {
		JSON.parse(data).forEach(function(phoneModel) {
			var id = phoneModel.id;
			phoneModels[id] = phoneModel;
			phoneModels[id].quantity = phones && phones[id] ? phones[id].quantity : 0;

			selectedQtys[id] = 1;
		});
	});

	$('.addCartButton').click(onAddCart);

	$('.quantitySelect').change(onQtySelected);

	$('#salesRepLink').click(handleSalesRepLink)
});

var handleSalesRepLink = function(e) {
	authenticateToken('/salesRep', showUnauthenticated);
};

var onAddCart = function(e) {
	var modelId = parseInt(e.target.type);
	var model = phoneModels[modelId];

	var qty = selectedQtys[modelId];
	model.quantity += qty;

	localStorage.setItem('phones', JSON.stringify(phoneModels));

	Materialize.toast(qty + ' Phone(s) Added to Cart', 4000)
};

var onQtySelected = function(e) {
	var modelId = parseInt(e.target.name);
	var qty = parseInt(e.target.value);

	if (selectedQtys[modelId]) {
		selectedQtys[modelId] = qty;
	}
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

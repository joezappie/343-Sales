var phoneModels = {};
var selectedQtys = {};

$(document).ready(function() {
	$('select').material_select();

	var phones = JSON.parse(localStorage.getItem('phones'));

	$.get('/consumed/inventory/models', function(data) {
		JSON.parse(data).forEach(function(item) {
			var phoneModel = item[0];
			phoneModels[phoneModel.pk] = phoneModel.fields;
			phoneModels[phoneModel.pk].quantity = Object.keys(phones).length === 0 ? 0 : phones[phoneModel.pk].quantity;

			selectedQtys[phoneModel.pk] = 1;
		});
	});

	$('.addCartButton').click(onAddCart);

	$('.quantitySelect').change(onQtySelected);
});

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

$(document).ready(function() {
	var phones = JSON.parse(localStorage.getItem('phones'));

	var cart = [];
	Object.keys(phones).forEach(function(key) {
		if (phones[key].quantity > 0) {
			cart.push(phones[key]);
		}
	});

	if (cart.length > 0) {
		$('#cartEmptyState').remove();
		$('.checkoutButton').removeClass('disabled');
		loadCart(cart);
	}
});

var loadCart = function(cart) {
	var tbody = document.querySelector('.cartTbody');

	cart.forEach(function(phone) {
		var trow = document.createElement('tr');

		var tdName = document.createElement('td');
		tdName.textContent = phone.description;

		var tdQty = document.createElement('td');
		tdQty.textContent = 'Qty: ' + phone.quantity;

		var tdPrice = document.createElement('td');
		tdPrice.textContent = '$' + phone.price * phone.quantity;

		trow.appendChild(tdName);
		trow.appendChild(tdQty);
		trow.appendChild(tdPrice);

		tbody.appendChild(trow);
	});
};

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

	$('.checkoutButton').on('click', function() {
		window.location.href = '/customerCheckout';
	});
});

var loadCart = function(cart) {
	var tbody = document.querySelector('.cartTbody');
	var total = 0;

	cart.forEach(function(phone) {
		total += phone.price * phone.quantity;

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

	var trow = document.createElement('tr');
	var tdName = document.createElement('td');
	var tdQty = document.createElement('td');
	var tdPrice = document.createElement('td');

	tdName.textContent = 'Total';
	tdPrice.textContent = '$' + total;

	trow.appendChild(tdName);
	trow.appendChild(tdQty);
	trow.appendChild(tdPrice);

	tbody.appendChild(trow);
};

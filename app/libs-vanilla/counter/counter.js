(function quantityCounter() {
	var _self = this,
		buttons = Array.prototype.slice.call(document.querySelectorAll('.counter__button'));

	this.bindEvents = function() {
		buttons.forEach(function(button) {
			button.addEventListener('click', _self.click);
		});
	}
	this.click = function() {
		var parent = this.parentNode,
			buttonType = this.classList.contains('counter-minus') ? 'minus' : 'plus',
			minValue = +parent.dataset.min,
			maxValue = +parent.dataset.max,
			countInp = parent.querySelector('input[type="hidden"]'),
			countField = parent.querySelector('.counter__count'),
			startValue = +countInp.value;

		_self.render(_self.counter(buttonType, {min: minValue, max: maxValue, start: startValue }), countInp, countField);
	},
	this.counter = function(type, vals) {
		if(type === 'minus'){
			vals.start--;
		}
		if(type === 'plus'){
			vals.start++;
		}

		if(vals.start < vals.min){
			vals.start = vals.min;
		}
		if(vals.start > vals.max){
			vals.start = vals.max;
		}
		return vals.start;
	}
	this.render = function(val, input, field) {
		input.value = val;
		field.textContent = val;
	}

	if(buttons.length > 0){
		this.bindEvents();
	}
})();
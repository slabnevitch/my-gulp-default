// Необходимо подключить mobileDetect.js + siblings.js либо all-functions.js
(function() {
	if(isMobile.any()){

		document.body.classList.add('touch');
		var arrows = document.querySelectorAll('[data-dropdown-icon]');

			for(var i=0; i < arrows.length; i++){
				arrows[i].addEventListener('click', function(e) {
					var parent = this.closest('[data-dropdowned]'),
							mainParent = this.closest('[data-dropdowned-parent]');

					parent.classList.toggle('active');
					Array.prototype.slice.call(parent.querySelectorAll('[data-dropdowned]'))
						.forEach(function(item) {
							item.classList.remove('active');
						})

					siblings(mainParent).forEach(function(item) {
						item.classList.remove('active');
					})

				});
			}

			document.addEventListener('click', function(e) {
				var targ = e.target;

				if (!targ.closest('[data-dropdowned]')){
					Array.prototype.slice.call(document.querySelector('.mulilevel-nav').querySelectorAll('[data-dropdowned]')).forEach(function(item) {
						item.classList.remove('active');
					});
				}
			});
	}else{
		document.body.classList.add('mouse');
	}
})();
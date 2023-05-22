// Необходимо подключить mobileDetect.js + siblings.js либо all-functions.js
if(isMobile.any()){

	document.body.classList.add('touch');
	var arrows = document.querySelectorAll('.menu-list__icon'),
 			mainParents = document.querySelectorAll('.menu-list__item');

		for(var i=0; i < arrows.length; i++){
			arrows[i].addEventListener('click', function(e) {
				var parent = this.closest('.menu-list__item, .submenu-list__item'),
						mainParent = this.closest('.menu-list__item');

				parent.classList.toggle('active');
				Array.prototype.slice.call(parent.querySelectorAll('.submenu-list__item'))
					.forEach(function(item) {
						item.classList.remove('active');
					})

				siblings(mainParent).forEach(function(item) {
					item.classList.remove('active');
				})

			});
		}

		document.onclick = function(e) {
		var targ = e.target;
		if (!targ.closest('.menu-list__item')){
			Array.prototype.slice.call(document.querySelector('.mulilevel-nav').querySelectorAll('.menu-list__item, .submenu-list__item')).forEach(function(item) {
				item.classList.remove('active');
			});
		}
	}
}else{
	document.body.classList.add('mouse');
}
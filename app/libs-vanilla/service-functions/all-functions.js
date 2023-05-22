// .webp browser support detection
function testWebP(callback) {
	var webP = new Image(); 
	webP.onload = webP.onerror = function () {
	 callback(webP.height == 2); 
	}; 
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
	if (support == true) {
	 document.querySelector('body').classList.add('webp'); 
	}else{ 
		document.querySelector('body').classList.add('no-webp'); 
	}
});
// END .webp browser support detection

var isMobile = {
	Android:        function() { return navigator.userAgent.match(/Android/i) ? true : false; },
	BlackBerry:     function() { return navigator.userAgent.match(/BlackBerry/i) ? true : false; },
	iOS:            function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false; },
	Windows:        function() { return navigator.userAgent.match(/IEMobile/i) ? true : false; },
	any:            function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());  }
};
// Use: if(isMobile.any()){ some code here }

var siblings = function ( elem ) {
	var createSiblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};
	return createSiblings( ( elem.parentNode || {} ).firstChild, elem );
}
/*Вызов: 	siblings(document.querySelectorAll('.sibl li')[0]); - вернет всех соседей первого li в списке*/

/*--------------------add/remove class to nodeLIst----------------------*/
function removeClass(elSelector, classToRemove) {
	var elems = document.querySelectorAll(elSelector);
	for (var i = 0; i < elems.length; i++) {
		elems[i].classList.remove(classToRemove);
	}
}
function addClass(elSelector, classToRemove) {
	var elems = document.querySelectorAll(elSelector);
	for (var i = 0; i < elems.length; i++) {
		elems[i].classList.add(classToRemove);
	}
}
/*Вызов: 	removeClass('.menu__item', 'touch-hover');*/

// Открытие и закрытие выпадающих меню на тач-устройствах(single-dropdown)
// if(window.innerWidth > 767.98 && isMobile.any()){// определяем, что клик с тач-скрина
// 	if(targetEl.classList.contains('menu__arrow')){// убежаемся, что кликнкнули по стрелке рядом со ссылкой
// 		targetEl.closest('.menu__item').classList.toggle('touch-hover');// родительскому пункту меню вешаем класс, который делает подменю открытым
// 		siblings('.menu__item', targetEl.closest('.menu__item'), 'touch-hover');// вызов ф-ции. для удаления такого класса у соседних пунктов меню		
// 	}
// 	if(!targetEl.closest('.menu__item') && document.querySelector('.menu__item.touch-hover') !== null){//провереряем клик вне выпадающего меню
// 		removeClass('.menu__item', 'touch-hover');//удаляем у всех пунктов меню активный класс
// 	}
// }
// (function() {
function singleDropdown(opts) {
		// var arrows = document.querySelectorAll('[data-single-dropdown]')
		// 		.querySelectorAll('.menu__arrow');

		init = function() {
			console.log('init!')
			bindEvents();
		}
		
		bindEvents = function() {
			// for(var i=0; i<arrows.length; i++){
			document.addEventListener('click', docClick);
			// }
		}
		docClick = function(e) {
			var targetEl = e.target;
			if(targetEl.classList.contains('menu__arrow') || targetEl.closest('.menu__arrow') != null){// убежаемся, что кликнкнули по стрелке рядом со ссылкой
				targetEl.closest('[data-single-dropdown]').classList.toggle('touch-hover');// родительскому пункту меню вешаем класс, который делает подменю открытым
				siblings('.menu__item', targetEl.closest('.menu__item'), 'touch-hover');// вызов ф-ции. для удаления такого класса у соседних пунктов меню		
			}
			if(!targetEl.closest('.menu__item') && document.querySelector('.menu__item.touch-hover') !== null){//провереряем клик вне выпадающего меню
				removeClass('.menu__item', 'touch-hover');//удаляем у всех пунктов меню активный класс
			}
		}

		init();
	}
if(document.querySelectorAll('[data-single-dropdown]') != null){
	singleDropdown();
}
// КОНЕЦ Открытие и закрытие выпадающих меню на тач-устройствах(single-dropdown)
// exports.siblings = siblings;
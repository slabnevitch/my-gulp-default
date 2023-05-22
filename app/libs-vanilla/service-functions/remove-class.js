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

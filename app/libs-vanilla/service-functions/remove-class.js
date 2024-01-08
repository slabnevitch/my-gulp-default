/*--------------------add/remove class to nodeLIst----------------------*/
function removeClass(elSelector, classToRemove) {
	if(typeof elSelector == 'string'){
		var elems = document.querySelectorAll(elSelector);
		for (var i = 0; i < elems.length; i++) {
			elems[i].classList.remove(classToRemove);
		}
	}else{	
		elSelector.classList.remove(classToRemove);
	}
}
function addClass(elSelector, classToRemove) {
	var elems = document.querySelectorAll(elSelector);
	for (var i = 0; i < elems.length; i++) {
		elems[i].classList.add(classToRemove);
	}
}
/*Вызов: 	removeClass('.menu__item', 'touch-hover');*/

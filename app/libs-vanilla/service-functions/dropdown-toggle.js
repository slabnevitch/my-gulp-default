// Открытие и закрытие выпадающих меню на тач-устройствах
if(window.innerWidth > 767.98 && isMobile.any()){// определяем, что клик с тач-скрина
	if(targetEl.classList.contains('menu__arrow')){// убежаемся, что кликнкнули по стрелке рядом со ссылкой
		targetEl.closest('.menu__item').classList.toggle('touch-hover');// родительскому пункту меню вешаем класс, который делает подменю открытым
		siblings('.menu__item', targetEl.closest('.menu__item'), 'touch-hover');// вызов ф-ции. для удаления такого класса у соседних пунктов меню		
	}
	if(!targetEl.closest('.menu__item') && document.querySelector('.menu__item.touch-hover') !== null){//провереряем клик вне выпадающего меню
		removeClass('.menu__item', 'touch-hover');//удаляем у всех пунктов меню активный класс
	}
}
// КОНЕЦ Открытие и закрытие выпадающих меню на тач-устройствах
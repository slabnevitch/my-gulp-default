// Открытие и закрытие выпадающих меню на тач-устройствах
(function dropdownToggle() {
	document.addEventListener('click', function(e) {
		var targetEl = e.target;

		if(window.innerWidth > 960 && isMobile.any()){// определяем, что клик с тач-скрина
			if(targetEl.hasAttribute('data-dropdown-arrow')){// убежаемся, что кликнкнули по стрелке рядом со ссылкой
	          targetEl.closest('[data-single-dropdown]').classList.toggle('touch-hover');// родительскому пункту меню вешаем класс, который делает подменю открытым   
	          var sibls = siblings(targetEl.closest('[data-single-dropdown]'));
	          for(var i=0; i < sibls.length; i++){
	              removeClass(sibls[i], 'touch-hover');// вызов ф-ции. для удаления такого класса у соседних пунктов меню
	            }
          	}
	        if(!targetEl.closest('[data-single-dropdown]') && document.querySelector('[data-single-dropdown].touch-hover') !== null){//провереряем клик вне выпадающего меню
	          removeClass('[data-single-dropdown]', 'touch-hover');//удаляем у всех пунктов меню активный класс
	        }
		}
	});
	// КОНЕЦ Открытие и закрытие выпадающих меню на тач-устройствах
})();
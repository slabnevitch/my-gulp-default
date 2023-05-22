(function scrollDisabler(){
	var body = document.body;
	
	return {
		disableScroll: function () {
			let pagePosition = window.scrollY;
			document.body.classList.add('disable-scroll');
			document.body.dataset.position = pagePosition;
			document.body.style.top = -pagePosition + 'px';
		},
		enableScroll: function () {
			let pagePosition = parseInt(document.body.dataset.position, 10);
			document.body.style.top = 'auto';
			document.body.classList.remove('disable-scroll');
			window.scroll({ top: pagePosition, left: 0 });
			document.body.removeAttribute('data-position');
		}
	}
})();

// scrollDisabler.disableScroll(); - отключение скролла стр-цы
// scrollDisabler.enableScroll(); - включение скролла стр-цы
// вызываются из любого места кода
// стили в misc/adjustment.scss
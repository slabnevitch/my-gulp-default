(function(){
	function MyAutosize(placeholder=false){
		const areas = [...document.querySelectorAll('[data-autosize]')];

		this.init = () => {
			this.areasCycle();
			this.events();
		}
		this.areasCycle = () => {
			if(areas.length){
				areas.forEach((elem) => {
					if(elem.value.length){
						this.autoHeightOnResize();
					}else if (elem.getAttribute('placeholder') && placeholder){
						this.autoHeightPlaceholder(elem);
					}
				});

				this.events();
			}
		}
		this.events = () => {
			areas.forEach((elem) => {
				elem.addEventListener('input', this.autoHeightOnInput);
			});
			window.addEventListener('resize', this.winResize);
		}
		this.winResize = () => {
			this.areasCycle();
		}
		this.autoHeightOnInput = (e) => {
		  // Сбрасываем высоту, чтобы она соответствовала текущему объему текста
		  e.target.style.height = '1px';
		  e.target.style.height =  e.target.scrollHeight + 'px';
		}
		this.autoHeightOnResize = () => {
		  	// Сбрасываем высоту, чтобы она соответствовала текущему объему текста
			areas.forEach(function(elem) {
				elem.style.height = '1px';
				elem.style.height =  elem.scrollHeight + 'px';
			});
		}
		this.autoHeightPlaceholder = (textarea) => {
			const computedStyle = window.getComputedStyle(textarea);
			const lineHeight = parseFloat(computedStyle.lineHeight); // Высота строки
			const paddingTop = parseFloat(computedStyle.paddingTop);
			const paddingBottom = parseFloat(computedStyle.paddingBottom);

			// Содержимое placeholder (или любой текст, который вы хотите проверить)
			const placeholderText = textarea.getAttribute('placeholder');

			// Временно создайте элемент для измерения
			const tempElement = document.createElement('div');
			tempElement.style.position = 'absolute';
			tempElement.style.visibility = 'hidden';
			tempElement.style.whiteSpace = 'pre-wrap'; // Сохранить переносы строк
			tempElement.style.width = textarea.offsetWidth + 'px'; // Такая же ширина
			tempElement.style.font = computedStyle.font; // Такой же шрифт
			tempElement.textContent = placeholderText;

			tempElement.style.paddingTop = parseInt(computedStyle.paddingTop) + 'px';
			tempElement.style.paddingBottom= parseInt(computedStyle.paddingBottom) + 'px';
			tempElement.style.paddingLeft = parseInt(computedStyle.paddingLeft) + 'px';
			tempElement.style.paddingRight= parseInt(computedStyle.paddingRight) + 'px';

			document.body.appendChild(tempElement);

			const placeholderHeight = tempElement.offsetHeight;
			document.body.removeChild(tempElement);
			
			textarea.style.height = '1px';
			textarea.style.height =  placeholderHeight + 'px';
		}

		this.init();
	}
	const myAutosize = new MyAutosize();

})();
var themeSwitcher = (function(opts) {

	var html = document.documentElement,
		saveUserTheme,
		userTheme,
		themeButton = document.querySelector(opts.switcher),
		resetButton = opts.reset ? document.querySelector(opts.reset) : null;
	
	init = function() {
		console.log('hemeSwitcher!!!')
		window.addEventListener('load', winLoad);
	},

	winLoad = function() {
		saveUserTheme = localStorage.getItem('user-theme');

		// проверяем, поддерживает ли браузер prefers-color-scheme
		// если да, то задаем значения темы из этого медиа запроса
		if(window.matchMedia){
			userTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}

		// вешаем на медиа-запрос событие изменения
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
			// если в локалСторадж ничего не записано, вызываем ф-цию. смены темы,
			// если записано, обнуляем saveUserTheme
			!saveUserTheme ? changeTheme() : null;
		});

		if(themeButton){
			themeButton.addEventListener('click', function() {
				if(resetButton){
					resetButton.classList.add('active');
				}
				changeTheme(true);
			});
		}
		if(resetButton){
			resetButton.addEventListener('click', function() {
				resetButton.classList.remove('active');
				localStorage.setItem('user-theme', '');
				console.log(localStorage.getItem('user-theme'))
			});
		}

		// добавление класса темы при загрузке стр-цы
		setThemeClass();
	},
	setThemeClass = function () {
		if(saveUserTheme){
			html.classList.add(saveUserTheme);
			if(resetButton){
				resetButton.classList.add('active');
			}
		}else{
			html.classList.add(userTheme);
		}
	},
	// смена темы
	changeTheme = function(saveTheme) {
		// определяем, откуда вызвана ф-ция.
		// есди вызвана из matchMedia, то saveTheme = false
		saveTheme = typeof saveTheme !== 'undefined' ?  saveTheme : false;

		console.log(saveTheme)

		// определеяем, какая тема установлена при загрузке стр-цы.
		var currentTheme = html.classList.contains('light') ? 'light' : 'dark',
			newTheme;

		// устанавливаем значение новой темы в зависимости от текущей
		if(currentTheme === 'light'){
			newTheme = 	'dark';
		}else if(currentTheme === 'dark'){
			newTheme = 	'light';
		}

		// меняем класс темы в хтмл
		html.classList.remove(currentTheme);
		html.classList.add(newTheme);

		//  если ф-ция. вызвана нажатием на кнопку переключения темы, записываем в localStorage новую тему
		// если вызвана из matchMedia - ничего не делаем
		saveTheme ? localStorage.setItem('user-theme', newTheme) : null;
	}

	init();
})({switcher: '.switcher', reset: null});
// switcher - селектор кнопки непосредственно переключения темы. Обязательный параметр.
// reset - селектор кнопки сброса темы в localStorage. Если кнопка сброса не нужна - передать null
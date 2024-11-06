module.exports = {
	// important: true,
	darkMode: 'selector',
	content: [ 'app/*.html', 'app/js/*.js', '!app/js/*.min.js' ],
	theme: {
		screens: { //полная перезапись дефолтных точек
			'lg': {'max': '1199.98px'},
			'md': {'max': '991.98px'},
			'sm': {'max': '767.98px'},
			'xs': {'max':' 575.98px'},
			'xss':{'max': '479.98px'},
			'xsss': {'max': '375.98px'},
			'min': {'max': '359.98px'},
			'mins': {'max': '319.98px'}
		},
		extend: {
			fontFamily: {
				poppins: ['"Poppins"', 'sans-serif'],
				montserrat: ['"Montserrat"', 'sans-serif']

			},
			backgroundImage: {
				heroGrad: 'linear-gradient(110.30deg, rgb(73, 35, 180) 3.247%,rgb(232, 120, 207) 96.826%)',
			},
			colors: {
				violet: '#5027B5',
				grayText: '#666768',
				darkbg: '#1B1B1B'
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms')({
		    strategy: 'base', // only generate global styles
		    // strategy: 'class', // only generate classes
		 }),
	]
}

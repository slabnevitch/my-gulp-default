// ibg class
if('objectFit' in document.documentElement.style === false){
	Array.prototype.forEach.call(document.querySelectorAll('._fit'), function(el){

		var image = el.querySelector('img');
		el.style.backgroundImage = 'url("'+image.src+'")';
		el.classList.add('ibg');
		el.classList.remove('_fit');
	});
}
// End ibg class
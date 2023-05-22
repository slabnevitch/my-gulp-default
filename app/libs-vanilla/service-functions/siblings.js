// function siblings(elSelector, el) {
// 	var elSiblings = document.querySelectorAll(elSelector),
// 		siblings = [];
// 	for (var i = 0; i < elSiblings.length; i++) {
// 		if(elSiblings[i] !== el){
// 			siblings.push(elSiblings[i])
// 		}
// 	}
// 	return siblings
// }

function siblings( elem ) {
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
var multilevelMenu = new MultilevelPanel({ 
  backAsCurrent: true,
  // activeBreakpoint: 1200,
  setDynamicBreakpoint: 1200
})

var sf = $('ul.sf-menu');

// Define the query
const mediaQuery = window.matchMedia('(min-width: 1200px)');
// if (mediaQuery.matches) {
// 	console.log('Media Query Matched!')
// }

function mediaQueryChange(e) {
  if (e.matches) {
    console.log('Media Query Matched!')
  	sf.superfish();
  	$('html').removeClass('multilevel-panel-opened freeze');
  	multilevelMenu.reset();
    console.log(sf.superfish);
  }else{
    console.log('Media Query NOT Matched!')
  	sf.superfish('destroy');
    console.log(sf.superfish);
  }
}
mediaQuery.addListener(mediaQueryChange);
mediaQueryChange(mediaQuery);


$(".toggle-mnu").click(function() {
	$('html').toggleClass('multilevel-panel-opened freeze');
	multilevelMenu.reset();
	return false;
})

var da = new DynamicAdapt("max");
da.init()
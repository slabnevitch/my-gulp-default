// .webp browser support detection
function testWebP(callback) {
  var webP = new Image(); 
  webP.onload = webP.onerror = function () {
   callback(webP.height == 2); 
  }; 
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  console.log('webp')
  if (support == true) {
   document.querySelector('body').classList.add('webp'); 
  }else{ 
    document.querySelector('body').classList.add('no-webp'); 
  }
});
// END .webp browser support detection

const isMobile = {
  Android:        function() { return navigator.userAgent.match(/Android/i) ? true : false; },
  BlackBerry:     function() { return navigator.userAgent.match(/BlackBerry/i) ? true : false; },
  iOS:            function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false; },
  Windows:        function() { return navigator.userAgent.match(/IEMobile/i) ? true : false; },
  any:            function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());  }
};
// Use: if(isMobile.any()){ some code here }

var siblings = function ( elem ) {

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
/*Вызов:  siblings(document.querySelectorAll('.sibl li')[0]); - вернет всех соседей первого li в списке*/

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
/*Вызов:  removeClass('.menu__item', 'touch-hover');*/

// Открытие и закрытие выпадающих меню на тач-устройствах(single-dropdown)

function singleDropdown() {
    // var arrows = document.querySelectorAll('[data-single-dropdown]')
    //    .querySelectorAll('.menu__arrow');

    init = function() {
      console.log('piadyuk!')
      bindEvents();
      // console.log(multiDropdown)
    }
    
    bindEvents = function() {
      // for(var i=0; i<arrows.length; i++){
      document.addEventListener('click', docClick);
      // }
    }
    docClick = function(e) {
      var targetEl = e.target;
      if(window.innerWidth > 960 && isMobile.any()){// определяем, что клик с тач-скрина
        if(targetEl.classList.contains('menu__arrow')){// убежаемся, что кликнкнули по стрелке рядом со ссылкой
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
    }

    init();
  }
// КОНЕЦ Открытие и закрытие выпадающих меню на тач-устройствах(single-dropdown)



function fadeIn(el, timeout = 10, display) {
  el.style.opacity = 0;
  el.style.display = display || 'block';
  el.style.transition = 'opacity ' + timeout+'ms';
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
};

function fadeOut(el, timeout){
  el.style.opacity = 1;
  el.style.transition = 'opacity ' + timeout+'ms';
  el.style.opacity = 0;

  setTimeout(() => {
    el.style.display = 'none';
  }, timeout);
};

function ScrollToSects(opts){
  var _self = this,
      opts = {
        linksContainer: opts.linksContainer || 'header',
        offset: opts.offset || 0,
        sectsSelector: opts.sectsSelector || 'section',
        delay: opts.delay || null,
        anchorSpy: opts.anchorSpy || false,
        activeClassAdding: opts.activeClassAdding
      },
      links = Array.prototype.slice.call(document.querySelector(opts.linksContainer)
              .querySelectorAll('[data-anchor]')),
      sects = Array.prototype.slice.call(document.querySelectorAll(opts.sectsSelector + '[data-anchor]')),
      pageHeader = document.querySelector('header'),
      gotoBlockValue = 0,
      observer;
   
  this.init = function(){
    this.events();
    // this.setObservers();
    if(opts.anchorSpy){this.observerInit();}
  },
  this.events = function(){
    links.forEach(function(link){
      if(link.dataset.anchor){
       link.addEventListener('click', _self.navClick);
      }else{
        console.log('nav links must have"data-anchor attribute"');
      }
    });
  },
  this.observerInit = function() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          console.log(entry.target);
          links.forEach(function(link) {
            if (link.dataset.anchor === entry.target.dataset.anchor) {
              link.classList.add('active');

            } else {
              link.classList.remove('active');
            }
          });
        }else{
           links.forEach(function(link) {
            link.classList.remove('active');
           });
        }
      });
    }, {
      threshold: 0.5
    });

    sects.forEach(section => { observer.observe(section)} );
  },
  this.navClick = function(e){
      e.preventDefault();
      sects.forEach(function(sect){
      if(sect.dataset.anchor === e.target.dataset.anchor){
        gotoBlockValue = sect.getBoundingClientRect().top + pageYOffset - pageHeader.offsetHeight + opts.offset;
      }
    });

   // добавление активных классов. Требует подключения service-functions/siblings.js
    if(opts.activeClassAdding){
      links.forEach(function(link) {
        link.classList.remove('active');
      });
      e.target.classList.add('active');
    }
  
   if(opts.delay){
     setTimeout(function(){
       _self.scrollToTarget(gotoBlockValue);
        // return;
     }, opts.delay);
    
   }else{
     _self.scrollToTarget(gotoBlockValue);
   }
    
  },
   this.scrollToTarget = function(scrollValue){
    // console.log(scrollValue);
    window.scrollTo({
      top: scrollValue,
      behavior: "smooth"
    }); 
  },
  this.setObservers = function() {
    sects.forEach(function(sect){
      var headerObserver = new IntersectionObserver(this.observerCallback);
      headerObserver.observe(sect);

    });
  },
  this.observerCallback = function(entries, observer) {
    console.log(entries);
    if(entries[0].isIntersecting){
      headerElem.classList.remove('_scroll');
    }else{
      headerElem.classList.add('_scroll');
    }
  }
  this.init();
}


module.exports.siblings = siblings;
module.exports.removeClass = removeClass;
module.exports.addClass = addClass;
module.exports.isMobile = isMobile;
module.exports.fadeIn = fadeIn;
module.exports.fadeOut = fadeOut;
module.exports.ScrollToSects = ScrollToSects;
// module.exports.multiDropdown = multiDropdown;
module.exports.singleDropdown = singleDropdown;
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

var siblings = function ( elem ) {// принимает только объекты, НЕ селекторы!

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
    init = function() {
      bindEvents();
    }
    
    bindEvents = function() {
      // for(var i=0; i<arrows.length; i++){
      document.addEventListener('click', docClick);
      // }
    }
    docClick = function(e) {
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
    }

    init();
  }
// КОНЕЦ Открытие и закрытие выпадающих меню на тач-устройствах(single-dropdown)

function multiDropdown(){
  if(isMobile.any()){

    document.body.classList.add('touch');
    var arrows = document.querySelectorAll('[data-dropdown-icon]');

      for(var i=0; i < arrows.length; i++){
        arrows[i].addEventListener('click', function(e) {
          var parent = this.closest('[data-dropdowned]'),
              mainParent = this.closest('[data-dropdowned-parent]');

          parent.classList.toggle('active');
          Array.prototype.slice.call(parent.querySelectorAll('[data-dropdowned]'))
            .forEach(function(item) {
              item.classList.remove('active');
            })

          siblings(mainParent).forEach(function(item) {
            item.classList.remove('active');
          })

        });
      }

      document.addEventListener('click', function(e) {
        var targ = e.target;

        if (!targ.closest('[data-dropdowned]')){
          Array.prototype.slice.call(document.querySelector('.mulilevel-nav').querySelectorAll('[data-dropdowned]')).forEach(function(item) {
            item.classList.remove('active');
          });
        }
      });
  }else{
    document.body.classList.add('mouse');
  }
}

function fadeIn(el, timeout = 10, display) {
  el.style.opacity = 0;
  el.style.display = display || 'block';
  el.style.transition = 'opacity ' + timeout+'ms';
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
}

function fadeOut(el, timeout){
  el.style.opacity = 1;
  el.style.transition = 'opacity ' + timeout+'ms';
  el.style.opacity = 0;

  setTimeout(() => {
    el.style.display = 'none';
  }, timeout);
}

function fadeToggle(el, timeout, display){
  console.log('fadeToggle');
  console.log(el);
  if(el.style.display !== 'none'){
    fadeOut(el, timeout);
  }else{
    fadeIn(el, timeout, display);
  }
}

let slideUp = (target, duration=500) => {
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.boxSizing = 'border-box';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  window.setTimeout( () => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
      //alert("!");
  }, duration);
}

let slideDown = (target, duration=500) => {
  target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;

  if (display === 'none')
    display = 'block';

  target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.boxSizing = 'border-box';
  target.style.transitionProperty = "height, margin, padding";
  target.style.transitionDuration = duration + 'ms';
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
  window.setTimeout( () => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration);
}
let slideToggle = (target, duration = 500) => {
  console.log('slideToggle')
  if (window.getComputedStyle(target).display === 'none') {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
}

/*
каждая ссылка навигации должны иметь атрибут data-anchor, а соответствующая ей секция - data-anchor-target  с одинаковыми значениями
*/
function ScrollToSects(opts){
  var _self = this,
      opts = {
        linksContainer: opts.linksContainer || 'header',
        offset: opts.offset || 0,
        sectsSelector: opts.sectsSelector || 'section',
        delay: opts.delay || null,
        anchorSpy: opts.anchorSpy || false,
        activeClassAdding: opts.activeClassAdding,
        afterNavClick: opts.afterNavClick || null
      },
      links = (function links(query){
        var queryArray = query.split(',');
        var overalArr = [];
        
        queryArray.forEach(queryItem => {
          var links = Array.prototype.slice.call(document.querySelectorAll(queryItem + ' [data-anchor]'));
          overalArr = Array.prototype.concat(overalArr, links);
        });

        return overalArr;
      })(opts.linksContainer),
      sects = Array.prototype.slice.call(document.querySelectorAll(opts.sectsSelector + '[data-anchor-target]')),
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
            if (link.dataset.anchor === entry.target.dataset.anchorTarget) {
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
      if(sect.dataset.anchorTarget === e.target.dataset.anchor){
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
    
    if(opts.afterNavClick){
      opts.afterNavClick();
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

function ScrollTabs() {
  const tabsContainer = document.querySelector('[data-scroll-tabs]'),
  tabsItems = tabsContainer.querySelectorAll('[data-scroll-tab]'),
  tabsArrows = document.querySelectorAll('[data-scroll-icon]'),
  {clientWidth, scrollWidth} = tabsContainer;

  this.init = () => {
    this.events();
    this.arrowsSwitcher();
      // this.updateIcons();
    this.updateIconsOnLoad();
    console.log('ScrollTabs!')
  }
  this.scrollbarCheck = (element) => element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
  this.arrowsSwitcher = () => {
      // console.log(this.scrollbarCheck(tabsContainer));
    tabsArrows.forEach(arrow => this.scrollbarCheck(tabsContainer) ? arrow.classList.remove('hidden') : arrow.classList.add('hidden'));
      // this.updateIcons();
  }
  this.events = () => {
    tabsItems.forEach(tabsItem => addEventListener('click', this.tabClick));
    tabsArrows.forEach(tabsArrow => addEventListener('click', this.arrowClick));
    tabsContainer.addEventListener('scroll', this.tabsScroll);
    tabsContainer.addEventListener('wheel', this.tabsWhell);
      // window.addEventListener('resize', this.resizeWatcher);
  }
    // this.resizeWatcher = () => this.updateIcons();
  this.tabClick = (e) => {
    console.log('tabClick');
    e.stopPropagation();
    e.target.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth'
    });
  }
  this.tabsWhell = (e) => {
    console.log('wheel!');

    tabsContainer.style.scrollBehavior = 'auto';
    tabsContainer.scrollLeft += e.deltaY;
  }
  this.arrowClick = (e) => {
    if(e.target.closest('[data-scroll-icon]') !== null){
      tabsContainer.style = '';

      if(e.target.closest('[data-scroll-icon]').dataset.scrollIcon === 'back'){
        tabsContainer.scrollLeft -= 200;
      }else if(e.target.closest('[data-scroll-icon]').dataset.scrollIcon === 'forw'){
        tabsContainer.scrollLeft += 200;
      }
    }
  }
  this.tabsScroll = (e) => this.updateIcons(e.target.scrollLeft);
  this.updateIcons = (scrolledWidth) => {
      // console.log(scrolledWidth <= 1)
    tabsArrows[0].classList.toggle('hidden', scrolledWidth <= 1);
    tabsArrows[1].classList.toggle('hidden', scrollWidth - (clientWidth + scrolledWidth) <= 1);
  }
  this.updateIconsOnLoad = (scrolledWidth) => {
      // console.log(scrolledWidth <= 1)
    scrolledWidth <= 1 ? tabsArrows[0].classList.remove('hidden') : tabsArrows[0].classList.add('hidden');

  }
  this.init();
}

module.exports.siblings = siblings;
module.exports.removeClass = removeClass;
module.exports.addClass = addClass;
module.exports.isMobile = isMobile;
module.exports.fadeIn = fadeIn;
module.exports.fadeOut = fadeOut;
module.exports.fadeToggle = fadeToggle;
module.exports.slideUp = slideUp;
module.exports.slideDown = slideDown;
module.exports.slideToggle= slideToggle;
module.exports.ScrollToSects = ScrollToSects;
module.exports.multiDropdown = multiDropdown;
module.exports.singleDropdown = singleDropdown;
module.exports.ScrollTabs = ScrollTabs;
var combine = function() {
    var targetContent = document.querySelectorAll('.combine .tab-content'),
        targetContainers = document.querySelectorAll('.combine .accordion__content'),
        htmlArr = [];

    tabsHandler = function(checkPoint){
      var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab')),
        tabsItems = Array.prototype.slice.call(document.querySelectorAll('.tab-content')),
        checkpoint =  checkPoint !== undefined ?  checkPoint : null;
    
    bindEvents = function(){
      tabs.forEach(function(el){
        el.addEventListener('click', clickHandler);
      });
    }
    clickHandler = function(e){
      // if(checkpoint && screen.width <=  checkPoint){
      //   return;
      // }

      e.preventDefault();
      var target = e.target.closest('.tab'),
        parent = target.closest('._tabs'),
        items = parent.querySelectorAll('.tab-content'),
        siblings = parent.querySelectorAll('.tab');
      
      console.log(target.textContent)
      // target.classList.add('active');

      for(var i=0; i<siblings.length; i++){
        if(siblings[i] == target){
          //alert(i);
          siblings[i].classList.add('active')
          items[i].classList.remove('hidden');

        }else{
          siblings[i].classList.remove('active')
          items[i].classList.add('hidden');
        }

      }
    }
    return {
      bindEvents
    }
  }

   accordion = function(checkPoint){
    var links = document.querySelectorAll('.accordion__link'),
    duration = 500;
    
    init = function(){
      for(var i=0 ; i<links.length; i++){
        links[i].addEventListener('click', clicker);  
      }
    },
    clicker = function(e){
      if(screen.width >= checkPoint){
        return;
      }
      e.preventDefault();
      var content = this.nextElementSibling,
      accordionList = e.target.closest('.accordion');
      slideToggle(content, duration);

      if(accordionList.hasAttribute('data-accordion')){
        slideSiblings(this, duration);
      }
    },
    slideSiblings = function(item){
      var parent = item.parentNode;
      var accordionChildren = item.closest('.accordion__item').parentNode.children;
      
      for(var i=0; i< accordionChildren.length; i++){
        if(accordionChildren[i] !== parent  && accordionChildren[i].querySelector('.accordion__content') !== null){
          slideUp(accordionChildren[i].querySelector('.accordion__content'), duration);
        }
      }
    },
    slideUp = function(target, duration){
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
      window.setTimeout( function(){
        target.classList.add('hidden');
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
      }, duration);
      target.parentNode.classList.remove('active');
    },
    slideDown = function(target, duration){
      target.classList.remove('hidden');
      let isHidden = target.classList.contains('hidden');
      if (isHidden) target.classList.remove('hidden');;
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
      window.setTimeout( function(){
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
      }, duration);
      target.parentNode.classList.add('active');
    },
    slideToggle = function(target, duration){
      if (target.classList.contains('hidden')) {
        return slideDown(target, duration);
      } else {
        return slideUp(target, duration);
      }
    }
    init();
  }

  adaptive = function(checkPoint) {
    
    Array.prototype.slice.call(targetContent).forEach(function(item) {
       htmlArr.push(item.querySelector('.replaced-tab-content'));
    });

    var mediaQuery = window.matchMedia('(max-width:' + checkPoint + 'px)');

    function mediaQueryChange(e) {
      if (e.matches) {
        // console.log('Media Query Matched!')
        replaceContent();

      }else{
        // console.log('Media Query NOT Matched!')
        returnContent();
      }
    }
    mediaQuery.addListener(mediaQueryChange);
    mediaQueryChange(mediaQuery);
  }

  replaceContent = function() {
    htmlArr.forEach(function(item, i) {
      targetContainers[i].insertAdjacentElement('beforeend', item);
    });
  }
  returnContent = function() {
     targetContainers.forEach(function(item, i) {
      targetContent[i].insertAdjacentElement('beforeend', htmlArr[i]);
    });
  }

  return{
    init: function(checkPoint){
      adaptive(checkPoint);
      tabsHandler(checkPoint).bindEvents();
      accordion(checkPoint);
    }
  }
}
//Call:
if(document.querySelector('.combine') !== null){
  combine().init(767.98); // аргумент checkpoint должен соответствовать $checkpoint в _tabs-accordion.scss
}

(function() {
  function Accordion(accordionList, duration/*, disableCheckPoint*/){
    var _self = this,
  	links;
    // checkpoint = disableCheckPoint !== undefined ? disableCheckPoint : null;
    
    this.init = function(){
    	links = this.linksFilter(accordionList, "accordion__link");

      for(var i=0 ; i<links.length; i++){
        links[i].addEventListener('click', this.clicker);  
      }
    },
    this.linksFilter = function(parent, tName) {
     tName = tName || '*';
     var c = [],
         elems = parent.getElementsByClassName(tName);

     for (var i = 0, l = elems.length; i < l; i++){
     	if (elems[i].parentNode.parentNode  == parent){
     		c.push(elems[i]);
     	} 
     } 
     return c;
  }
    this.clicker = function(e){
      if(accordionList.hasAttribute('data-breakpoint') && screen.width >= +accordionList.dataset.breakpoint){
      
      	return;
      }
  	e.preventDefault();
      var content = this.nextElementSibling;

      _self.slideToggle(content, duration);

      if(accordionList.hasAttribute('data-accordion')){
        _self.slideSiblings(this, duration);
   	}
    },
    this.slideSiblings = function(item){
      var parent = item.parentNode;
      var accordionChildren = item.closest('.accordion__item').parentNode.children;
      
      for(var i=0; i< accordionChildren.length; i++){
        if(accordionChildren[i] !== parent  && accordionChildren[i].querySelector('.accordion__content') !== null){
          this.slideUp(accordionChildren[i].querySelector('.accordion__content'), duration);
        }
      }
    },
     this.slideUp = function(target, duration){

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
        // target.style.display = 'none';
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
    this.slideDown = function(target, duration){
      // target.style.removeProperty('display');
      target.classList.remove('hidden');
      let isHidden = target.classList.contains('hidden');
      if (isHidden) target.classList.remove('hidden');;
      // target.style.display = display;
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
    this.slideToggle = function(target, duration){
      if (target.classList.contains('hidden')) {
        return this.slideDown(target, duration);
      } else {
        return this.slideUp(target, duration);
      }
    }
    this.init();
  }

  // Call:
  if(document.querySelectorAll('.accordion') !== null){
  	Array.prototype.slice.call(document.querySelectorAll('.accordion'))
  		.forEach(function(item){
  			new Accordion(item, 500);
  		});
  }
  // 500 - animatin speed
  // 767.98 - max-width where accordion don't work (deprecated)
})();

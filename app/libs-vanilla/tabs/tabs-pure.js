(function() {
  var tabsHandler = function(checkPoint){
     var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab')),
        tabsItems = Array.prototype.slice.call(document.querySelectorAll('.tab-content')),
        checkpoint =  checkPoint !== undefined ?  checkPoint : null;
    
    bindEvents = function(){
      tabs.forEach(function(el){
        el.addEventListener('click', clickHandler);
      });
    }
    clickHandler = function(e){
      if(checkpoint && screen.width <=  checkPoint){
        return;
      }
      e.preventDefault();
      var target = e.target.closest('.tab'),
        parent = target.closest('._tabs'),
        items = parent.querySelectorAll('.tab-content'),
        siblings = parent.querySelectorAll('.tab');
      
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
    return{
      init: function(){
        bindEvents();
      }
    }
    
  }
  if(document.querySelector('._tabs') !== null){
    tabsHandler().init();
  }

})();


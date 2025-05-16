/*
каждая ссылка навигации должны иметь атрибут data-anchor, а соответствующая ей секция - data-anchor-target  с одинаковыми значениями
*/
function ScrollToSects(opts){
  var _self = this,
      opts = {
        linksContainer: opts.linksContainer || 'header',
        offsetTopCountdownElem: opts.offsetTopCountdownElem || 'header',
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
      pageHeader = document.querySelector(offsetTopCountdownElem),
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
      if(sect.dataset.anchorTarget === e.target.closest('[data-anchor]').dataset.anchor){
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
new ScrollToSects({
    linksContainer: 'header',//контейнер, в котором лежат кнопки навигации. Если контейнеров несколько, перечислить ч/з запятую.
    // offsetTopCountdownElem: 'selector', // елемент, по которому отсчитывается отступ от верхнего края экрана (в случае, если отсчитывается не от 'header')
    // offset: -50,//отступ от верха экрана при прокрутке (если нужен)
    sectsSelector: '[data-anchor-target]',//селектор секций, default - "section"
     // delay: 300,//задержка перед прокруткой. Может понадобится, елсли перед прокруткой нужно время на анимацию закрытия моб. меню, например
     // anchorSpy: false, //добавление активного класса ссылке при скролле, если соответствующая ей секция попадает в экран
     // activeClassAdding: false, //добавление классов активным ссылкам
    // afterNavClick: function(){
    //   // выполнится после нажатия на любою кнопку навигации, перед задержкой, если она задана

    // }
  });
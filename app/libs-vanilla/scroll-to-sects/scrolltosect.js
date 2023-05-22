/*
каждая ссылка навигации и соответствующая ей секция должны иметь атрибут data-anchor с одинаковым значением
*/
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
          links.forEach(function(link) {
            if (link.dataset.anchor === entry.target.dataset.anchor) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
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
  }
  this.init();
}
// new ScrollToSects({
//   linksContainer: 'header',//контейнер, в котором лежат кнопки навигации
//   offset: 50,//отступ от верха экрана при прокрутке (если нужен)
//   sectsSelector: '.sect',//селектор секций, если не section
//    delay: 0,//задержка перед прокруткой. Может понадобится, елсли перед прокруткой нужно время на анимацию закрытия моб. меню, например
    // anchorSpy: true //добавление активного класса ссылке при скролле, если соответствующая ей секция попадает в экран
    // activeClassAdding: false //добавление классов активным ссылкам
// });
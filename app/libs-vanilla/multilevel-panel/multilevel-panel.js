(function() {
  function MultilevelPanel(opts){
    var _self = this,
      htmlDoc = document.documentElement,
      panel = document.querySelector('.multilevel-panel'),
      multilevelMenuElem = document.querySelector('.multilevel-menu'),
      links = Array.prototype.slice.call(document.querySelectorAll('.multilevel-menu__parent > a, .multilevel-menu .with-submenu > a')),
      panel = document.querySelector('.multilevel-panel'),
      close = document.getElementById('multilevel-panel-close'),
      open = document.getElementById('multilevel-panel-open'),
      submenus = Array.prototype.slice.call(document.querySelectorAll('.multilevel-menu ul')),
      backButton = document.getElementById('menu-back'),
      back = document.querySelector('.multilevel-panel__back'),
      backTexts = [],
      options = {
        backAsCurrent: opts.backAsCurrent !== undefined ? opts.backAsCurrent : false,
        activeBreakpoint: opts.activeBreakpoint !== undefined ? opts.activeBreakpoint : null,
        setDynamicBreakpoint: opts.setDynamicBreakpoint !== undefined ? opts.setDynamicBreakpoint : null,
        bodyFreeze: opts.bodyFreeze !== undefined ? opts.bodyFreeze : null,
        multicolumn: opts.multicolumn, 
        multicolumnClass: opts.multicolumnClass, 
        multiLiItemClass:  opts.multiLiItemClass 
      };
    
    this.init = function(){

      if(!options.multicolumn){
        if(options.setDynamicBreakpoint){
          multilevelMenuElem.setAttribute('data-da', 'multilevel-panel,'+options.setDynamicBreakpoint+',2');
        }
        this.eventsBinding(links);
      }
      if(options.multicolumn){
        this.createPanelHtml();
      }
      
    },
    this.createPanelHtml = function() {

      if(options.multicolumnClass && options.multiLiItemClass){

        var copiedItems = multilevelMenuElem.querySelectorAll('.' + options.multiLiItemClass);
          panelUl = document.createElement('ul');
          panelUl.className = 'multilevel-menu';

        
        for(var i=0; i<copiedItems.length; i++){
          var copy = copiedItems[i].cloneNode(true);
          panelUl.appendChild(copy);
        }
        panel.appendChild(panelUl);
        this.eventsBinding(panel.querySelectorAll('.multilevel-menu .with-submenu > a'));
        console.log(panel.querySelectorAll('.multilevel-panel .multilevel-menu .with-submenu > a'));
        }else{
          console.log('multilevel-panel error!: не указаны классы для колонок и li для копирования');
        }
    },
    this.eventsBinding = function(menuLinks){
      menuLinks.forEach(item => {
        item.addEventListener('click', this.linksClick);
      });
      backButton.addEventListener('click', this.backClick);
      close.addEventListener('click', this.close);
      if(open){
        open.addEventListener('click', this.open);
      }
    },
    this.linksClick = function(e){
      console.log('linksClick!');
      if(options.activeBreakpoint !== null && screen.width > options.activeBreakpoint){
        console.log('linksClick returned!');
        return;
      }
      e.preventDefault();
      var currentSubmenu = e.target.parentNode.querySelector('ul');
      currentSubmenu.classList.add('active');
      back.classList.add('active');

      if(options.backAsCurrent){
        backButton.textContent = e.target.textContent;
        backTexts.push(e.target.textContent);
      }

      panel.scrollTop = 0;
      panel.classList.add('freeze');
    },
    this.backClick = function(e){
      
      var activeMenus = Array.prototype.slice.call(document.querySelectorAll('.multilevel-menu ul.active'));

      if(activeMenus.length > 0){
        activeMenus[activeMenus.length - 1].classList.remove('active');

        if(options.backAsCurrent){
          e.target.textContent = backTexts[activeMenus.length - 2];
          backTexts.pop();
        }

        if(activeMenus.length === 1){
          _self.reset();
        }
      }
    },
    this.close = function() {
      htmlDoc.classList.remove('multilevel-panel-opened', 'freeze', 'catalog-visible');
      _self.reset();
    },
    this.open = function() {
      htmlDoc.classList.add('multilevel-panel-opened', 'catalog-visible');
      if(options.bodyFreeze){
        htmlDoc.classList.add('freeze');
      }
    },
    this.reset = function(){
      back.classList.remove('active');
      panel.classList.remove('freeze');
      backTexts = [];
      Array.prototype.slice.call(document.querySelectorAll('.multilevel-menu ul.active'))
        .forEach(function(menu){
          menu.classList.remove('active');
      });
    }
    
    this.init();
  }
  // Use
  // требуется подключить сперва dynamic-adaptive, а уже после него multilevel-panel.js!
 // панель открывается путем добавления к <html> класса "multilevel-panel-opened"
 var panel = new MultilevelPanel({ 
      backAsCurrent: true, //boolean |указание заголовка текущей ссылки вместо "назад"
      activeBreakpoint: 1100, //number | ширина экрана, при которой перестают раскрываться вложенные меню в левой панели
    // setDynamicBreakpoint: 1100, //nubmer |ширина экрана, при которой da.js переносит десктопное меню в левую панель
                                  // применять только если структура десктопного меню соответствует мобильному
                               // работает только при da.init() в common.js либо при добавлении атрибута data-da к десктопному меню заранее
    bodyFreeze: true, // boolean ,
    multicolumn: false, //true только в случае различия хтмл в десктопном и мобильном меню (например, при наличии доп. дивов-колонок, в которые завернуты эл-ты. десктопного меню)
    multicolumnClass: 'catalog-header__column',// класс для дива-обертки над эл-ми. десктопного меню
    multiLiItemClass: 'catalog-header__item' //класс для "<li>" десктопного меню, которые необходимо скопировать в моб. меню-панель
  });

})();
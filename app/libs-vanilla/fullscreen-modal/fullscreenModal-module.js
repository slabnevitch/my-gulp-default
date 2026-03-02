export const fullscrenModalHandler = function(){
  var openTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-fullscreen-open]')),
      closeTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-fullscreen-close]')),
      fullScreenModals = Array.prototype.slice.call(document.querySelectorAll('[data-fullscreen-target]')),
      isMobile = {
        iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false; }
      },
      currentDocScroll = 0;

  const events = () => {
      if(openTriggers.length > 0){
        openTriggers.forEach((item) => {
          item.addEventListener('click', fullscreenModalOpen);
        });
      }
      if(closeTriggers.length > 0){
        closeTriggers.forEach((item) => {
          item.addEventListener('click', fullscreenModalClose);
        });
      }
    };
    const fullscreenModalOpen = (e) => {
      // берем модалку, соответсвующую кнопке открытия       
      var currentModalTargetSelector = e.target.closest('[data-fullscreen-open]')
        .getAttribute('data-fullscreen-open');
      
      //получаем верт. прокрутку страницы       
      currentDocScroll = window.pageYOffset;
      
      if(currentDocScroll){//если есть прокрутка - убираем плавный скролл страницы
         document.documentElement.style.scrollBehavior = 'auto';
      } 
     
      document.querySelector(`[data-fullscreen-target=${currentModalTargetSelector}]`)
        .classList.add('active');
      document.body.classList.add('modal-open');
		 document.documentElement.classList.add('fullscreen-modal-open');
    };
    const fullscreenModalClose = (e) => {
     document.body.classList.remove('modal-open');
		 document.documentElement.classList.remove('fullscreen-modal-open');
      
      if(currentDocScroll){//если при открытии модалки была прокрутка страницы
        // вызываем прокрутку страницы в положение, которое было при открытии модалки
       returnDocSavedScroll(currentDocScroll);
      } 
      
      var closeBtn = e.target.closest('[data-fullscreen-close]')
        if(closeBtn.getAttribute('data-fullscreen-close') != null && closeBtn.getAttribute('data-fullscreen-close') != '' && !closeBtn.hasAttribute('data-fullscreen-close-all')){
          closeBtn.closest('[data-fullscreen-target]').classList.remove('active');
        }else if(closeBtn.hasAttribute('data-fullscreen-close-all') && fullScreenModals.length > 0){
            fullScreenModals.forEach(modal => modal.classList.remove('active'));
        }
    };
   const returnDocSavedScroll = (value) => {
				// после закрытия модалки прокручиваем страницу к тому месту, на котором был скролл во время открытия модалки
				window.scrollTo(0,value);
      // обнуляем значение скролла страницы, на котором было открыта модалка
				currentDocScroll = 0;
      // возвращаем плавную прокрутку страницы       
				document.documentElement.style.scrollBehavior = 'smooth';
			};
  return{
    init(){
      if(isMobile.iOS()){document.documentElement.classList.add('is-os-ios');}
      events();
    }
  }
};
// if(document.querySelectorAll('[data-fullscreen-open]') != null && document.querySelectorAll('[data-fullscreen-close]') != null){
//      fullscrenModalHandler().init();                     
// }
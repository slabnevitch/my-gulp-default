// basetHeight - начальная высота выдвигания (Number)
// heightFixed - можно ли двигать модалку вверж, выше basetHeight (true/false)
// dragTreshold - нижний порог, при здвигании ниже которого модалка закрывается (Number)
// isBodyTouch - должна ли работать "протяжка" модалки за контентную часть
function myBottomSheet(id, openTrigger, basetHeight, heightFixed, dragTreshold, isBodyTouch){
		var _self = this;
		var bottomSheet = document.querySelector(id);
		var showModalBtn = document.querySelector(openTrigger);
		var hideModalBtn = document.querySelector(id).querySelector("#bottom-sheet-hide");
		var sheetOverlay = bottomSheet.querySelector(".bottom-sheet__sheet-overlay");
		var sheetContent = bottomSheet.querySelector(".bottom-sheet__content");
		var sheetBody = bottomSheet.querySelector(".bottom-sheet__body");
		var dragIcon = bottomSheet.querySelector(".bottom-sheet__header");
		var isDragging = false, startY, startHeight;
		var openFlag = false;

		this.init = function(){
			this.events();
		}

		this.events = function(){
			dragIcon.addEventListener("mousedown", this.dragStart);
			document.addEventListener("mousemove", this.dragging);
			document.addEventListener("mouseup", this.dragStop);
			dragIcon.addEventListener("touchstart", this.dragStart);
			document.addEventListener("touchmove", this.dragging);
			document.addEventListener("touchend", this.dragStop);
			sheetOverlay.addEventListener("click", this.hideBottomSheet);
			hideModalBtn.addEventListener("click", this.hideBottomSheet);
			showModalBtn.addEventListener("click", this.showBottomSheet);

			if(isBodyTouch){//если нужно закрытие модалки при протяжке за ее контеньную часть
				// добавляем слушатели для контентной части
				sheetBody.addEventListener("mousedown", this.dragStart);
				sheetBody.addEventListener("touchstart", this.dragStart);
			}
		}

		this.showBottomSheet = function(){
			// на случай, если в последний раз модалка была закрыта через hideBottomSheetFade() - т.е. без анимации
			bottomSheet.classList.remove("hidden");
		    setTimeout(() => {
	    		bottomSheet.classList.add("show");
		    }, 10);
			//End на случай, если в последний раз модалка была закрыта через hideBottomSheetFade() - т.е. без анимации

		    document.body.style.overflow = "hidden";
		    _self.updateSheetHeight(basetHeight);
		}
		this.updateSheetHeight = function(height){
		    sheetContent.style.height = height + 'vh';
		    bottomSheet.classList.toggle("fullscreen", height === 100);
		}
		this.hideBottomSheet = function(e){
		    bottomSheet.classList.remove("show");

		    setTimeout(function(){
		    	if(!bottomSheet.classList.contains('show')){
		    		document.body.style.overflow = "auto";
		    		document.body.classList.remove('bottomsheet-open');
		    		_self.documentOverscrollBehaviorToggle(false);
		    	}
		    }, 100);

		    _self.openTriggerClassToggle();
		}
		this.hideBottomSheetFade = function(e){
		    bottomSheet.classList.add("hidden");
    		bottomSheet.classList.remove("show");

    		setTimeout(function() {
		    	if(!bottomSheet.classList.contains('show')){
		    		document.body.style.overflow = "auto";
		    		document.body.classList.remove('bottomsheet-open');
		    		_self.documentOverscrollBehaviorToggle(false);
		    	}
		    }, 100);

		    _self.openTriggerClassToggle();
		}
		this.dragStart = function(e){
		    isDragging = true;
		    startY = e.pageY || e.touches?.[0].pageY;
		    startHeight = parseInt(sheetContent.style.height);
		    bottomSheet.classList.add("dragging");
		}
		this.dragging = function(e){
		    if(!isDragging) return;
		    var delta = startY - (e.pageY || e.touches?.[0].pageY);
		    var newHeight = startHeight + delta / window.innerHeight * 100;

		    if(heightFixed){
		    	if(newHeight > basetHeight) newHeight = basetHeight;
		    }
		    
		    _self.updateSheetHeight(newHeight);
		}
		this.dragStop = function(e){
		    isDragging = false;
		    bottomSheet.classList.remove("dragging");
		    var sheetHeight = parseInt(sheetContent.style.height);

	    	sheetHeight < dragTreshold ? _self.hideBottomSheet() : sheetHeight > basetHeight ? _self.updateSheetHeight(100) : _self.updateSheetHeight(basetHeight);
		}
		this.openTriggerClassToggle = function(e){//установка/снятие активного класса у кнопки открытия bottomSheet при открытой модалке
			if(showModalBtn.hasAttribute('data-bottomsheet-trigger')){
				showModalBtn.classList.toggle('active');
			}
		}
		this.documentOverscrollBehaviorToggle = function(flag){
			//установка/снятие у <html> класса для отключения обновления страницы "протяжкой" в Chrome
			if(flag){
				document.documentElement.classList.add('overscroll-none');
			}else {
				document.documentElement.classList.remove('overscroll-none');
				
			}
		}
		this.init();
		return{
			init: this.init,
			hideBottomSheet: this.hideBottomSheet,
			hideBottomSheetFade: this.hideBottomSheetFade
		}
	 }

	// // Можно создавать несколько разных bottomSheet на стр-це., для каждого нужен отдельный экзеипляр со своими настройками
	// if(document.querySelector('#bottomsheet') !== null){
	// 	var varsSheet = new myBottomSheet('#bottomsheet', '#open', 58, false, 50, false);
	// }
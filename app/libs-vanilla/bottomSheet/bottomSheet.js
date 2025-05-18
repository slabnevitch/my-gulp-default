// basetHeight - начальная высота выдвигания (Number)
// heightFixed - можно ли двигать модалку вверж, выше basetHeight (true/false)
// dragTreshold - нижний порог, при здвигании ниже которого модалка закрывается (Number)
function myBottomSheet(id, openTrigger, basetHeight, heightFixed, dragTreshold){
		var _self = this;
		var bottomSheet = document.querySelector(id);
		var showModalBtn = document.querySelector(openTrigger);
		var hideModalBtn = document.querySelector(id).querySelector("#bottom-sheet-hide");
		var sheetOverlay = bottomSheet.querySelector(".bottom-sheet__sheet-overlay");
		var sheetContent = bottomSheet.querySelector(".bottom-sheet__content");
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
		}

		this.showBottomSheet = function(){
			// setTimeout(() => {
			// $(bottomSheet).show(20);
			    bottomSheet.classList.add("show");
		    // bottomSheet.style.visibility = 'visible';
		    // }, 100);
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

			    	}
			    }, 100);

		}
		this.hideBottomSheetFade = function(e){
		    // bottomSheet.style.visibility = 'hidden';
		    // $(bottomSheet).hide(20);

		    setTimeout(() => {
		    		bottomSheet.classList.remove("show");
		    }, 1000);
		    setTimeout(function(){
		    	if(!bottomSheet.classList.contains('show')){
		    		document.body.style.overflow = "auto";

		    	}
		    }, 100);
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
		    // if(e.target.closest('.bottom-sheet__body') == null){
		    	sheetHeight < dragTreshold ? _self.hideBottomSheet() : sheetHeight > basetHeight ? _self.updateSheetHeight(100) : _self.updateSheetHeight(basetHeight);
		    	// if(	sheetHeight < 55 ){
		    	// 	this.hideBottomSheet()
		    	// }else if( sheetHeight > 55 && sheetHeight < basetHeight){
		    	// 	this.updateSheetHeight(basetHeight);

		    	// }else if( sheetHeight > basetHeight){
		    	// 	this.updateSheetHeight(basetHeight);
		    	// }

		    // }
		}
		this.init();
		return{
			init: this.init,
			hideBottomSheet: this.hideBottomSheet,
			hideBottomSheetFade: this.hideBottomSheetFade
		}
	 }

	// Можно создавать несколько разных bottomSheet на стр-це., для каждого нужен отдельный экзеипляр со своими настройками
	if(document.querySelector('#bottomsheet') !== null){
		var varsSheet = new myBottomSheet('#bottomsheet', '#open', 58, false, 50);
	}
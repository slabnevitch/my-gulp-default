(function() {
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
	new ScrollTabs();

})();
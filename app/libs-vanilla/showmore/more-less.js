export class ReadMore {
      constructor(options = {}) {
        // Default settings with spread operator for custom options
        this.settings = {
          speed: 300,
          activeClass: 'is-active',
          selector: '[data-more]',
          selectorFooter: '[data-more-footer]',
          selectorTrigger: '[data-more-trigger]',
          selectorContent: '[data-more-content]',
          ...options
        };

        this.init();
      }

      init() {
        // Initialize elements
        this.elements = document.querySelectorAll(this.settings.selector);
        if (!this.elements.length) return;

        // Bind events
        this.bindEvents();
        
        // Initial setup
        this.setupElements();
        
        // Initial check for short content
        this.checkContentLengths();
      }

      bindEvents() {
        // Bind with proper context
        this.clickHandler = this.clickHandler.bind(this);
        this.resizeHandler = this.debounce(this.checkContentLengths.bind(this), 250);

        // Add event listeners
        document.addEventListener('click', this.clickHandler);
        window.addEventListener('resize', this.resizeHandler);
      }

      setupElements() {
        this.elements.forEach(element => {
          const content = element.querySelector(this.settings.selectorContent);
          if (!content) return;

          // Store original height for future reference
          content.dataset.originalHeight = content.scrollHeight;
        });
      }

      checkContentLengths() {
        this.elements.forEach(parent => {
          const content = parent.querySelector(this.settings.selectorContent);
          const footer = parent.querySelector(this.settings.selectorFooter);
          if (!content || !footer) return;

          // Temporarily remove any height restrictions to measure true height
          const originalHeight = content.style.height;
          content.style.height = 'auto';
          const actualHeight = content.scrollHeight;
          
          const definedHeight = parseInt(content.dataset.moreHeight);

          if (actualHeight <= definedHeight) {
            content.style.height = 'auto';
            footer.style.display = 'none';
          } else {
            footer.style.display = '';
            if (!parent.classList.contains(this.settings.activeClass)) {
              content.style.height = `${definedHeight}px`;
            } else {
              content.style.height = originalHeight;
            }
          }
        });
      }

      clickHandler(event) {
        const trigger = event.target.closest(this.settings.selectorTrigger);
        if (!trigger) return;

        event.preventDefault();
        this.toggleContent(event, trigger);
      }

      toggleContent(event, trigger) {
        const parent = trigger.closest(this.settings.selector);
        const content = parent?.querySelector(this.settings.selectorContent);
        
        if (!parent || !content) return;

        if (parent.classList.contains(this.settings.activeClass)) {
          this.collapse(trigger, content, parent);
        } else {
          this.expand(trigger, content, parent);
        }
      }

      expand(trigger, content, parent) {
        // First, get the current height
        const currentHeight = content.offsetHeight;
        
        // Temporarily remove transition and set current height
        content.style.transition = 'none';
        content.style.height = `${currentHeight}px`;
        
        // Force repaint
        content.offsetHeight;
        
        // Remove any height restrictions to measure full content height
        content.style.height = '';
        const targetHeight = content.scrollHeight;
        
        // Set back to current height
        content.style.height = `${currentHeight}px`;
        
        // Force repaint again
        content.offsetHeight;
        
        // Add transition and animate to target height
        content.style.transition = `height ${this.settings.speed}ms ease`;
        content.style.height = `${targetHeight}px`;
        
        parent.classList.add(this.settings.activeClass);
        trigger.textContent = trigger.dataset.moreTextLess;

        // After animation completes, set height to auto
        this.onTransitionEnd(content, () => {
          content.style.height = 'auto';
        });
      }

      collapse(trigger, content, parent) {
        // First, set explicit current height
        content.style.transition = 'none';
        content.style.height = `${content.scrollHeight}px`;
        
        // Force repaint
        content.offsetHeight;
        
        // Add transition
        content.style.transition = `height ${this.settings.speed}ms ease`;
        
        // On next frame, set target height
        requestAnimationFrame(() => {
          const definedHeight = content.dataset.moreHeight;
          content.style.height = `${definedHeight}px`;
        });
        
        parent.classList.remove(this.settings.activeClass);
        trigger.textContent = trigger.dataset.moreTextMore;
      }

      onTransitionEnd(element, callback) {
        const handler = (e) => {
          if (e.target === element && e.propertyName === 'height') {
            element.removeEventListener('transitionend', handler);
            callback();
          }
        };
        element.addEventListener('transitionend', handler);
      }

      debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
          const later = () => {
            clearTimeout(timeout);
            func(...args);
          };
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
        };
      }

      destroy() {
        // Remove event listeners
        document.removeEventListener('click', this.clickHandler);
        window.removeEventListener('resize', this.resizeHandler);
        
        // Reset elements
        this.elements.forEach(parent => {
          const content = parent.querySelector(this.settings.selectorContent);
          if (content) {
            content.style.height = '';
            content.style.transition = '';
          }
        });
      }
    }
var scrollWidth = {
    init: function () {
      var div = document.createElement('div');

      div.style.overflowY = 'scroll';
      div.style.width = '50px';
      div.style.height = '50px';

      document.body.append(div);

      var scrollWidth = div.offsetWidth - div.clientWidth;

      div.remove();

     	var root = document.documentElement;
      root.style.setProperty('--scroll-width', scrollWidth + 'px');
    }
  };

  scrollWidth.init();
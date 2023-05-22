function fadeIn(el, timeout = 10, display) {
  el.style.opacity = 0;
  el.style.display = display || 'block';
  el.style.transition = 'opacity ' + timeout+'ms';
  setTimeout(() => {
    el.style.opacity = 1;
  }, 10);
};

function fadeOut(el, timeout){
  el.style.opacity = 1;
  el.style.transition = 'opacity ' + timeout+'ms';
  el.style.opacity = 0;

  setTimeout(() => {
    el.style.display = 'none';
  }, timeout);
};
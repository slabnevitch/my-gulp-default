// (function(){
//   var detailsSpoilers = function(siblings){
  
//   var spoilers = document.querySelectorAll('[data-spoiler-item]'),
//        minimizeSiblings = siblings;
  
//   init = function(){
//     spoilersCycle();
//   }
//   spoilersCycle = function(){
//     Array.prototype.slice.call(spoilers).forEach(item => {
//        var question = item.querySelector('[data-spoiler-title]'),
//        answer = item.querySelector('[data-spoiler-content]'),
//        animationDuration = getComputedStyle(answer).getPropertyValue('--animation-duration'),
//        milliseconds = parseInt(parseFloat(animationDuration) * (/\ds$/.test(animationDuration) ? 1000 : 1)),
//        setHeight = function(){answer.style.setProperty('--details-height', answer.scrollHeight + 'px')};

//       item.classList.add('js-details');

//       if (item.open) {
//         item.classList.add('is-open');
//         setHeight();
//       } else {
//         item.open = true;
//         setHeight();
//         item.open = false;
//       }
      
//       question.addEventListener('click', clickListener);
//     });
//   }
//   clickListener = function(e){
//     var item = e.target.closest('[data-spoiler-item]'),
//        answer = item.querySelector('[data-spoiler-content]'),
//        animationDuration = getComputedStyle(answer).getPropertyValue('--animation-duration'),
//        milliseconds = parseInt(parseFloat(animationDuration) * (/\ds$/.test(animationDuration) ? 1000 : 1));
//     console.log(item)
//     item.classList.toggle('is-open');
    
//     if (item.open) {
//       event.preventDefault();
//       setTimeout(function () {
//         item.open = false;
//       }, milliseconds);
//     }

//     if (!minimizeSiblings) return;
    
//     const siblings = Array.prototype.slice.call(item.parentNode.children)
//     .filter(function(el){return el.classList.contains('js-details')})
//       .filter(function(el){ return el !== event.target.parentNode});
    
//     siblings.forEach(el => {
//       el.classList.remove('is-open')
//       setTimeout(function () {
//         el.open = false
//       }, milliseconds)
//     });
//   }
//   init();
// }
//   detailsSpoilers(true);//true - при открытии одного спойлера закрываются его сиблинги; false - не закрываются
// })();

(function(){
  var detailsSpoilers = function(minimizeSiblings){
  var spoilers = Array.prototype.slice.call(document.querySelectorAll('[data-spoilers]')),                   
      spoilersItems = Array.prototype.slice.call(document.querySelectorAll('[data-spoiler-item]')),
      points = [],
      matches = [];
  
  init = function(){
    spoilersCycle();
    openAllSpoilers();
    mediaQuerySpy();
  }
  spoilersCycle = function(){
    spoilersItems.forEach(function(item){
       var question = item.querySelector('[data-spoiler-title]'),
       answer = item.querySelector('[data-spoiler-content]'),
       animationDuration = getComputedStyle(answer).getPropertyValue('--animation-duration'),
       milliseconds = parseInt(parseFloat(animationDuration) * (/\ds$/.test(animationDuration) ? 1000 : 1)),
       setHeight = function(){answer.style.setProperty('--details-height', answer.scrollHeight + 'px')};
      
      item.classList.add('js-details');
        if (item.open) {
          item.classList.add('is-open');
          setHeight();
        } else {
          item.open = true;
          setHeight();
          item.open = false;
        }
      question.addEventListener('click', clickListener);
    });
  }
  clickListener = function(e){
    var item = e.target.closest('[data-spoiler-item]'),
        point = item.parentNode.dataset.point,
       answer = item.querySelector('[data-spoiler-content]'),
       animationDuration = getComputedStyle(answer).getPropertyValue('--animation-duration'),
       milliseconds = parseInt(parseFloat(animationDuration) * (/\ds$/.test(animationDuration) ? 1000 : 1));
    if(point && window.innerWidth > point){
      e.preventDefault();
    }else{
      item.classList.toggle('is-open');
    
    if (item.open) {
      event.preventDefault();
      setTimeout(function () {
        item.open = false;
      }, milliseconds);
    }

    if (!item.closest('[data-spoilers]').hasAttribute('data-minimizeSiblings')) return;
    
    const siblings = Array.prototype.slice.call(item.parentNode.children)
      .filter(function(el){return el.classList.contains('js-details')})
      .filter(function(el){ return el !== event.target.parentNode});
    
      siblings.forEach(function(el){
        el.classList.remove('is-open')
        setTimeout(function () {
          el.open = false
        }, milliseconds)
      });
    }
  }
  closeAllSpoilers = function(translatedSpoiler){
    var currentSpoiler = translatedSpoiler; 
    console.log('currentSpoiler' + currentSpoiler);
    if(currentSpoiler){
    
        Array.prototype.slice.call(currentSpoiler.querySelectorAll('[data-spoiler-item]')).forEach(function(spoilerItem){
        console.log('spoilerItem' + spoilerItem)
       spoilerItem.classList.remove('is-open')
        setTimeout(function () {
          spoilerItem.open = false
        }, 300);
       });
    }
  }
  openAllSpoilers = function(translatedSpoiler){
    var currentSpoiler = translatedSpoiler; 
      if(currentSpoiler){
       Array.prototype.slice.call(currentSpoiler.querySelectorAll('[data-spoiler-item]')).forEach(function(spoilerItem){
       console.log(window.innerWidth)
          spoilerItem.classList.add('is-open');
            spoilerItem.open = true;
     });
    }
   

  }
  mediaQuerySpy = function(){
     spoilers.forEach(function(el){
       if(el.getAttribute('data-point') !== null){
         points.push(el.dataset.point);
          var mediaQuery = window.matchMedia('(max-width:' + el.dataset.point + 'px)');
           matches.push(mediaQuery);
           mediaQuery.addListener(mediaQueryChange);
           mediaQueryChange(mediaQuery);
       }

    });

 }
  mediaQueryChange = function(e) {
        if (e.matches) {
          console.log('matches')
          selectCurrentSpoilers(true);

        }else{
           console.log('dont matches')
            selectCurrentSpoilers(false);
        }
      }
    
    selectCurrentSpoilers = function(condition){
      var curr = matches.filter(function(match, i){
            return condition ? match.matches : !match.matches;
          });

           var pointedSpoilers = [];
          curr.forEach(function(item, i){
            spoilers.forEach(function(wrap){
              if(wrap.dataset.point === points[matches.indexOf(item)]){
                pointedSpoilers.push(wrap);
              }
            });
          });
      
          pointedSpoilers.forEach(function(spoiler){
               condition ? closeAllSpoilers(spoiler) : openAllSpoilers(spoiler);
          });
    }

  init();
}
  if(document.querySelectorAll('[data-spoiler-item]') != null){
     detailsSpoilers();
  }
 
})();
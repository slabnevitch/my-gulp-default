// import {tns} from '~/app/libs-vanilla/tiny-slider/dist/tiny-slider.js';
import Swiper from "swiper";
import { Pagination, EffectFade } from 'swiper/modules';

// ---Для slick slider
// Import vendor jQuery plugin example (not module)
// import $ from '~/app/libs/jquery/jquery.min.js';
import $ from 'jquery'
// window.jQuery = $;// $ можно будет использовать за пределами модуля
// window.$ = $;// $ можно будет использовать за пределами модуля
$('header').text('pidaras');
// sliderPluginName - название слайдера('tiny' || 'swiper' || 'slick') [String]
// sliderSelector - селектор, который подхватит слайдер. [String]
// cardsSelector - селектор отдельной карточки тоаара, в которой есть слайдер [String]
// breakpoint - ширина экрана, на которой происходит переход слайдера в моб. режим [Number]. Для tiny slider сработают только целые значения, не дробные! 

export const mouseMooveSlider = function(sliderPluginName, sliderSelector, cardsSelector, breakpoint){
  var _self = this,
      cards = document.querySelectorAll(cardsSelector),
      sliders = [],//пустой массиив для инициализированных слайдеров
      slidersSettings = {
        tiny: {
          selector: sliderSelector,
          opts: {},
          init: function(selector, options){
           Array.from(document.querySelectorAll(selector)).forEach(function(item){
              var slider = tns( {
                container: item,
                items: 1,
                loop: false,
                controls: false,
                mouseDrag: false,
                responsive: {
                  [breakpoint]: {
                    touch: false,
                    speed: 0
                  }
                }
              });
            
              sliders.push(slider);// пушим все запущенные слайдеры в массив (для swiper это нужно)
            });
          },
          slideChange: function(slider,slide){
             slider.goTo(slide);
          },
          slidesToStartPos: function(slider){
            slider.goTo(0);
          },
          getSlidesCount: function(slider){
            return slider.getInfo().slideCount;
          }
        },
        swiper: {
          selector: sliderSelector,
          opts: {
           modules: [Pagination, EffectFade], //если swiper подключается через import
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            watchSlidesProgress: true,//предотвращает прокрутку слайдов при клике на ссылку внутри слайда
            
            // If we need pagination
            pagination: {
              el: '.swiper-pagination',
              type: 'bullets',
              // clickable: true
            },
            breakpoints: {
              // when window width is >= 320px
              [breakpoint]: {
                  speed: 0,
                  allowTouchMove: false,
                   effect: 'fade',
                  fadeEffect: {
                    crossFade: true
                  },
                }
            }
          },
          init: function(selector, options){
            sliders = new Swiper(selector, options);
          },
          slideChange: function(slider,slide){
             slider.slideTo(slide);
          },
          slidesToStartPos: function(slider){
            slider.slideTo(0);
          },
          getSlidesCount: function(slider){
            return slider.slides.length;
          }
          
        },
        slick: {
          selector: sliderSelector,
          opts: {
            slidesToScroll: 1,
            slidesToShow: 1,
            dots: true,
            arrows: false,
            fade: true,
            draggable: false,
            swipe: false,
            dotsClass: 'slick-dots slick-dots-mosemove',
            customPaging : function(slider, i) {
              // var thumb = $(slider.$slides[i]).attr('data-thumb');
               // console.log('sllides[i]' + slider.$slides[i]);
              // console.log(thumb);
                return '<button class="slick-dot-mosemove"></button>';
            },
            responsive: [
                {
                  breakpoint: breakpoint,
                  settings: {
                    swipe: true,
                    fade: false,
                  }	
                }
              ]
          },
          init: function(selector, options){
             $(selector).each((i,slider)=>{
              const slickSlider = $(slider).slick(options);
              sliders.push(slider);
            });
          },
          slideChange: function(slider,slide){
             $(slider).slick('slickGoTo', slide);
          },
          slidesToStartPos: function(slider){
            $(slider).slick('slickGoTo', 0);
          },
          getSlidesCount: function(slider){
            return $(sliders).slick('getSlick').slideCount;
          }
        }
      },
      usedSlider = slidersSettings[sliderPluginName],//выбираем используемый слайдер по названию
      sliderItem;//переменная для помещения в неё текущего слайдера из массива sliders при наведении на карточку мышью
  
  this.init = function(){
    this.slidersInit();// запускаем все слайдеры внутри карточек товаров
    this.events();// вешаем на document событие mousemove
  }
  this.slidersInit = function(){
    usedSlider.init(usedSlider.selector, usedSlider.opts);
  }
  this.events = function(){
    document.addEventListener('mousemove', this.docMouseMoove);
  }
  this.docMouseMoove = function(e){
    // console.log('docMouseMoove!')
    var targetElement = e.target;

    // если мышь над карточкой-слайдером и ширина экрана соответствует заданной breakpoint
    if(targetElement.closest('[data-mousemove-slider]') && window.innerWidth >= breakpoint){// проверяем, находится ли курсор над карточкой
       // console.log('курсор над карточкой!');
      
      var sliderElement = targetElement.closest('[data-mousemove-slider]').closest('.card'); //получаем карточку
      sliderItem = sliders[_self.getIndex(sliderElement)];//получаем слайдер, над кооторым наш курсор
      var sliderLength = usedSlider.getSlidesCount(sliderItem); //берем количество слайдов в слайдере
      
      if(!sliderElement.classList.contains('mousemoved')){
        sliderElement.classList.add('mousemoved');//добавляем карточке класс для показа буллетов навигации
      }
      if(sliderLength > 0){
        var sliderWidth = sliderElement.offsetWidth;//получаем ширину текущего слайдера
         var sliderPath = Math.round(sliderWidth / sliderLength),// делим слайдер по ширине на кол-во. частей, равное кол-ву. слайдов в нем
             sliderMousePos = e.clientX - sliderElement.getBoundingClientRect().left,//находим позицию мыши
             sliderSlide = Math.floor(sliderMousePos / sliderPath);//узнаем, над какой частью слайдера находится курсор
        // console.log(sliderSlide);
        if(Math.floor(sliderMousePos / sliderPath) < sliderLength ){//Внимание! Возможно, это ошибочное условие if
         usedSlider.slideChange(sliderItem, sliderSlide);//прокручиваем слайдер к нужному слайду
          
          // sliderItem.goTo(sliderSlide);
        }
      }
    }else{
       if(sliderItem){
          usedSlider.slidesToStartPos(sliderItem);
       }
       Array.prototype.slice.call(cards)
        .forEach(function(card){
         card.classList.remove('mousemoved');//если курсор уходит с карточки, убираем у нее класс для показа кнопок навигации
       })
    }
  },
  this.getIndex = function(sliderElement){
    return Array.prototype.slice.call(sliderElement.parentNode.children).indexOf(sliderElement);//вычисляем текущий слайдер в массиве всех слайдеров
  }
  
  this.init();
};
// new mouseMooveSlider('slick', '.slick-mousemove', '.card', 991.98);
// new mouseMooveSlider('tiny', '.tiny-mousemove', '.card', 992);
// new mouseMooveSlider('swiper', '.swiper-mousemove', '.card', 991.98); // 'tiny' || 'swiper' || 'slick'
// module.exports.mouseMooveSlider = mouseMooveSlider;
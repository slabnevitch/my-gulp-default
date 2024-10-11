const buildMode = 'webpack'; // ('simple' || 'webpack')

var gulp = require('gulp');
var sass = sass = require('gulp-sass')(require('sass'));
var sassGlob = require('gulp-sass-glob');
var watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
var spritesmith = require('gulp.spritesmith');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');
var cssnano = require('gulp-cssnano');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpJade = require('gulp-jade');
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');
var smartgrid = require('smart-grid');
var gcmq = require('gulp-group-css-media-queries');
var browserSync = require('browser-sync');
var ttf2woff = require('gulp-ttf2woff');
// var ttf2woff2 = require('gulp-ttf2woff2');
var ttf2eot = require('gulp-ttf2eot');
const babel = require('gulp-babel');
const webp = require('gulp-webp');
let webphtml = require('gulp-webp-html-nosvg');
const webpack = require('webpack-stream');
const rename = require('gulp-rename');
var webpcss = require("gulp-webpcss");
const fs = require("fs");
const mqpacker = require("css-mqpacker");
var postcss = require('gulp-postcss');
const sortCSSmq = require('sort-css-media-queries');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app',
      index: 'about.html' /*страница, которую нужно обновлять. По умолчаню index.html*/
    },
    notify: false,
    // tunnel: true,
    // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
  });
});

gulp.task('common-js', function() {
  return gulp.src([
    'app/js/common.js',
    ])
  // .pipe(concat('common.min.js'))
  .pipe(uglify())
  .pipe(rename({ suffix: ".min" }))
  .pipe(gulp.dest('app/js'));
});

gulp.task('babel-js', function(){ 
  gulp.src('app/src/js/common.js')
      .pipe(babel({
          presets: ['env']
      }))
      .pipe(gulp.dest('app/js/common-es5'))
});

gulp.task('webpack-stream', function(){ 
  return gulp.src(['app/js/*.js', '!app/js/*.min.js', '!app/js/common.js'])
    .pipe(webpack({
      mode: 'production',
      performance: { hints: false },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/env'],
              plugins: ['babel-plugin-root-import']
            }
          }
        ]
      },
      optimization: {
              minimize: true
          }
    })).on('error', function handleError() {
      this.emit('end')
    })
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream())
});

gulp.task('jade', function () {
  return gulp.src('app/jade/**.jade')
    .pipe(gulpJade({
      pretty: true
    }))
    .pipe(gulp.dest('app/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('group', function () {
    gulp.src('app/css/main.css')
        // .pipe(gcmq())
        .pipe(gulp.dest('app/css'));
});
gulp.task('media-packer', async function () {
   const result = mqpacker.pack(fs.readFileSync("app/css/main.css", "utf8"), {
      from: "main.css",
      // map: {
      //   inline: false
      // },
      sort: true,
      to: "main.css"
    });
    fs.writeFileSync("dist/css/main.css", result.css);

    // gulp.src('app/css/main.css')
    //     // .pipe(gcmq())
    //     .pipe(gulp.dest('app/css'));
});

gulp.task('sass', function () {
  var processors = [
    mqpacker({
      sort: sortCSSmq.desktopFirst
    })
  ];
  return gulp.src('app/sass/main.scss')
    .pipe(sassGlob())
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
            grid:true,
            // grid:"autoplace",
            browsers: ['last 15 versions', '>1%'/*, 'ie 8', 'ie 7'*/],
            cascade: false
          }))
    .pipe(postcss(processors)) //группировка media-queries
    .pipe(cssnano())
    // .pipe(gcmq()) // автозамена background-image на .webp. Необходимо подключение в верстку /service-functions/webp-detection.js
    // .pipe(webpcss({}))

    .pipe(sourcemaps.write('maps/'))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

// function watch() {
//   gulp.watch('app/sass/**/*.scss', ['sass']);
//   gulp.watch('app/jade/**/*.jade', ['jade']);
//   // gulp.watch('app/src/js/common.js', ['babel-js']);
//   gulp.watch('app/*.html', browserSync.reload);
// };
gulp.task('watch', function () {
  gulp.watch('app/sass/**/*.scss',  gulp.series('sass'));
  gulp.watch('app/jade/**/*.jade',  gulp.series('jade'));
  if(buildMode === 'webpack'){
    gulp.watch(['app/js/**/*.js', '!app/js/*.min.js', '!app/js/common.js'],  gulp.series('webpack-stream'));
  }
  if(buildMode === 'simple'){
    gulp.watch('app/js/common.js', gulp.series('common-js')).on('change', browserSync.reload);
  }
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss',
    imgPath: '../img/sprite.png',
    padding: 5
  }));
  
  spriteData.img.pipe(gulp.dest('app/img/'));
  spriteData.css.pipe(gulp.dest('app/sass/_misc/'));
  //return spriteData.pipe(gulp.dest('img/'));
});


gulp.task('svgSprite', function () {
  return gulp.src('app/img/icons-svg/*.svg')
  
  // При использовании в режиме "stack" перед каждым запуском таска
    // удалить файл "svg-sprite.svg" из папки img/icons-svg !

    // .pipe(svgSprite({
    //             mode: {
    //                 stack: {
    //                     sprite: "../svg-sprite.svg",  //sprite file name
    //                     render: {
    //                       scss: {
    //                         dest:'../../../sass/_misc/_sprite-svg.scss',
    //                         template: 'app/sass/_misc/_sprite_template.scss'
    //                       }
    //                     }
    //                 }
    //             },
    //         }
    //     ))

  // minify svg
  // При исп-ии. в режиме symbol, если необходимо добавить иконку в спрайт вручную:
  // 1. тег <svg> исходной иконки исправить на <symbol> и добавить необходимый id
  // 2. удалить аттрибуты width и height
  // 3. добавить в sprite.svg внутрь единственного тега <svg>
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // remove all fill, style and stroke declarations in out shapes
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {xmlMode: true}
    }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    // build svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "sprite.svg",
          example: true,
          render: {
            scss: {
              dest:'../../../sass/_misc/_sprite-svg.scss',
              template: 'app/sass/_misc/_sprite_template.scss'
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('app/img/icons-svg'));
});

gulp.task('smartgrid', function() {
  var settings = {
    outputStyle: 'scss', /* less || scss || sass || styl */
    columns: 12, /* number of grid columns */
    offset: '16px', /* gutter width px || % */
    container: {
        maxWidth: '1440px', /* max-width оn very large screen */
        fields: '24px' /* side fields */
    },
    breakPoints: {

        max: {
          width: '1392px'
        },
        lg: {
         width: '1199px'
        },
        md: {
         width: '991px'
        },
        mob: {
         width: '959.98px'
        },
        sm: {
         width: '767.98px'
        },
        xs: {
         width: '576px'
        },
        xss:  {
         width:  '479.98px'
        },
        xsss: {
         width:'375px'
        },
        min: {
         width: '360px',
        },
        mins: {
         width: '320px'
        }
        /* 
        We can create any quantity of break points.
 
        some_name: {
            some_width: 'Npx',
            some_offset: 'N(px|%)'
        }
        */
    }
};
 
smartgrid('app/sass/_misc', settings);
});

gulp.task('fontsConvert', function(){
  gulp.src(['app/src/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('app/fonts/'));
  // gulp.src(['app/font-source/*.ttf'])
  //   .pipe(ttf2eot())
  //   .pipe(gulp.dest('app/fonts/'));
  gulp.src(['app/src/fonts/*.ttf'])
    .pipe(gulp.dest('app/fonts/'));
  return gulp.src(['app/src/fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('app/fonts/'));
});

gulp.task('imgOptim', function() {
  return gulp.src(['app/img/**/*'], {
    ignore: ['app/img/icons-svg/**', 'app/img/favicon/**']
    })
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(gulp.dest('dist/img'))
    .pipe(gulp.src(['app/img/**/*'], {
       ignore: ['app/img/icons-svg/**']
    }))
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [imageminPngquant()]
    }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('optima', function() {
   gulp.src('app/img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'))
});

gulp.task('css-min', /*['sass'],*/ function() {
  return gulp.src('app/css/main.css') // Выбираем файл для минификации
    .pipe(cssnano()) // Сжимаем
    .pipe(gulp.dest('dist/css')); // Выгружаем в папку app/css
});

gulp.task('libs-min', gulp.series('sass'), function() {
  return gulp.src('app/css/libs.css') // Выбираем файл для минификации
    .pipe(cssnano()) // Сжимаем
    .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});

gulp.task('clean', function() {
  return del('dist/**/*', { force: true }); // Удаляем все файлы в папке dist перед сборкой
});

gulp.task('scripts', function() {
  return gulp.src([ // Берем все необходимые библиотеки
    'app/libs/jquery/jquery-1.11.2.min.js', // Берем jQuery
    // 'app/libs/tooltipster/js/tooltipster.bundle.min.js',
    'app/libs/dropdown/js/jquery.dropdown.min.js',
    'app/libs/slideout/slideout.js',
    'app/libs/lazy-master/jquery.lazy.min.js',
    'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    'app/libs/superfish/hoverIntent.js',
    'app/libs/superfish/superfish.js',
    'app/libs/slick/slick.min.js'
    // 'app/libs/waypoints/waypoints.min.js',
    // 'app/libs/animate/animate-css.js'
    // 'app/libs/mmenu/jquery.mmenu.js',
    // 'app/libs/mmenu/addons/pagescroll/jquery.mmenu.pagescroll.js',
    // 'app/libs/gsap/src/minified/jquery.gsap.min.js',
    // 'app/libs/gsap/src/minified/TimelineMax.min.js',
    // 'app/libs/gsap/src/minified/TweenMax.min.js',
    // 'app/libs/gsap/src/minified/easing/EasePack.min.js'


    ])
    .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
    .pipe(uglify()) // Сжимаем JS файл
    .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});

gulp.task('copyCss', () => {
   // return gulp.src('app/css/*.css')
  // .pipe(gcmq())
  // .pipe(cssnano())
  // .pipe(gulp.dest('dist/css'))
  
  var processors = [
    mqpacker({
      sort: sortCSSmq.desktopFirst
    })
  ];

  return gulp.src('app/sass/main.scss')
    .pipe(sassGlob())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
            grid:true,
            // grid:"autoplace",
            browsers: ['last 15 versions', '>1%'/*, 'ie 8', 'ie 7'*/],
            cascade: false
          }))
    // .pipe(gcmq()) // автозамена background-image на .webp. Необходимо подключение в верстку /service-functions/webp-detection.js
    // .pipe(webpcss({}))

  // док-ция. про плагин https://github.com/OlehDutchenko/sort-css-media-queries/blob/master/README-UK.md
  .pipe(postcss(processors))
  // .pipe(cssnano())
  .pipe(gulp.dest('dist/css/'))
  .pipe(gulp.src('app/css/main.min.css'))
  .pipe(gulp.dest('dist/css/'));
});

gulp.task('copySvgSprite', function() {
  return gulp.src(['app/img/icons-svg/symbol/sprite.svg'])
      .pipe(gulp.dest('dist/img/icons-svg/symbol'));
});

gulp.task('copyFonts', () => {
   return gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
          .pipe(gulp.dest('dist/fonts'));
});
gulp.task('copyJs', () => {
  if(buildMode === 'webpack'){
   return gulp.src(['app/js/main.js', 'app/js/main.min.js', '!app/js/common.js']) // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'));
  }
  if(buildMode === 'simple'){
    return gulp.src(['app/js/**/*', '!app/js/main.js', '!app/js/main.min.js']) // Переносим скрипты в продакшен
      // .pipe(uglify()) // минификация
      .pipe(gulp.dest('dist/js'));
    }
});
gulp.task('copyHtml', () => {
   return gulp.src('app/*.html') // Переносим HTML в продакшен
      .pipe(webphtml()) // Автозамена картинок на .webp через <picture></picture>
      .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel(/*'imgOptim',*/ 'watch', 'sass', /*'jade',*/ 'browser-sync'));
gulp.task('build', gulp.series('clean', 'sass', 'jade', 'imgOptim', 'copyCss', 'copyFonts', /*'copySvgSprite',*/ 'copyJs', 'copyHtml'/* 'sass', 'css-min'/* 'group'*/));
  
  // var buildSvg = gulp.src('app/img/icons-svg/**/*') // Переносим svg в продакшен
  // .pipe(gulp.dest('dist/img/icons-svg/'));
const { task, src, watch, dest } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const imagemin = require('gulp-imagemin');

const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');

// sass.compiler = require('node-sass');

function scss() {
    return src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest('dist/css'))
}

function imgmin() {
    return src('src/assets/images/*.*')
    .pipe(imagemin())
	.pipe(dest('dist/images'))
}

function generateSprite() {
    // Берём все картинки из папки sprite/*.*
    const spriteData = src('src/assets/sprite/*.*')
        .pipe(spritesmith({//вызываем плагин pritesmith - и передаём ему определённые настройки
            imgName: 'sprite.png',//как будет называться картинка
            imgPath: '../images/sprite.png',//адрес background, который должен прописываться в стилях
            cssName: '_sprite.scss',//хотим сгеннерировать стили с scss
            padding: 5//вокруг каждой картинки
    }));
    //Идёт разделение на потоки
    const imgStream = spriteData.img
    //
        .pipe(dest('src/assets/images'));
    // 
    const cssStream = spriteData.css
      .pipe(dest('src/scss/mixins'));
  
    //
    return merge(imgStream, cssStream);
  }


task('watch', () => {
    // единаразово при запуске этой задачи, вызовет каждую из этих функций, задач
    scss();
    imgmin();
    generateSprite();

    watch('src/assets/sprite/*.*', generateSprite);
    watch('src/assets/images/*.*', imgmin);
    watch('src/scss/**/*.scss', scss);
});
var gulp = require('gulp');
var sass = require('gulp-sass');
var serve = require('gulp-webserver-fast');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

//翻译scss--自动翻译
gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('dist/css/'))
});
//自动刷新html
gulp.task('server',['sass','concat','uglify'],function () {
    //监听scss的翻译
    gulp.watch('src/sass/*.scss',['sass'],function () {
        console.log('sass file changed')
    });
    gulp.watch('src/js/*',['concat']);
    gulp.watch('dist/js/*.js',['uglify']);

    return gulp.src('./')
        .pipe(serve({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('concat',function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('uglify',['concat'],function () {
    return gulp.src('dist/js/concat.js')
        .pipe(uglify())
        .pipe(rename('concat.min.js'))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('clean',function () {
    return gulp.src('dist/')
        .pipe(clean())
});

gulp.task('default',['clean','server']);
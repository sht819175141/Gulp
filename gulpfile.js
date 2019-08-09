var gulp = require('gulp');
var sass = require('gulp-sass');
var serve = require('gulp-webserver-fast');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var url = require('url');
var fs = require('fs');
var browserify = require("gulp-browserify");

gulp.task("module", function () {
    return gulp.src("src/js/script2.js")
        .pipe(browserify())
        .pipe(rename("module.js"))
        .pipe(gulp.dest("dist/js"))
})

gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('server', ['sass', 'concat', 'uglify'], function () {
    gulp.watch('src/sass/*.scss', ['sass'], function () {
        console.log('sass file changed')
    });
    gulp.watch('src/js/*', ['concat']);
    gulp.watch('dist/js/*', ['uglify']);

    return gulp.src('./')
        .pipe(serve({
            livereload: true,
            directoryListing: true,
            open: true,
            middleware: function (req, res, next) {
                var reqObj = url.parse(req.url, true);

                switch (reqObj.pathname) {
                    case '/tmp/aa': res.setHeader('Content-Type', 'application/json');
                        var files = fs.readFileSync('data/abc.json');
                        res.end(files);
                        break;
                    case '/tmp/bb': res.setHeader('Content-Type', 'application/json');
                        var files = fs.readFileSync('data/abc2.json');
                        res.end(files);
                        break;
                    default:
                }
                // mock数据
                next();
            }
        }));
});

gulp.task('concat', function () {
    return gulp.src('src/js/*')
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('uglify', ['concat'], function () {
    return gulp.src('dist/js/concat.js')
        .pipe(uglify())
        .pipe(rename('concat.min.js'))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('clean', function () {
    return gulp.src('dist/')
        .pipe(clean())
});

gulp.task('default', ['clean', 'server']);
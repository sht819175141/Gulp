var gulp=require("gulp");
var sass=require("gulp-sass");
var server=require("gulp-webserver-fast");
var rename=require("gulp-rename");
var concat=require("gulp-concat");
var uglify=require("gulp-uglify");
var clean = require('gulp-clean');

gulp.task("concat1",function(){
	return gulp.src("src/sass/*.scss")
		.pipe(concat("styles.scss"))
		.pipe(gulp.dest("dist/css/"))
})

gulp.task("sass",["concat1"],function(){
	return gulp.src("dist/css/styles.scss")
		.pipe(sass())
		.pipe(rename("styles.css"))
		.pipe(gulp.dest("dist/css/"))
})

gulp.task('concat',function () {
    return gulp.src('src/js/*')
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task("uglify",["concat"],function(){
	return gulp.src('dist/js/concat.js')
	.pipe(uglify())
	.pipe(rename("concat.min.js"))
	.pipe(gulp.dest("dist/js/"))
})

gulp.task("server",["sass","concat","uglify"],function(){
	gulp.watch("src/sass/*.scss",["concat","sass"]);
	gulp.watch("src/js/*",["concat"]);
	gulp.watch("dist/js/*",["uglify"]);
	return gulp.src("./")
		.pipe(server({
            livereload: true,
            directoryListing: true,
            open: true
        }));
})

gulp.task('default',['server']);
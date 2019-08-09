var gulp=require('gulp');
var sass=require('gulp-sass');
var serve=require('gulp-webserver-fast');
	gulp.task("sass",function(){
		gulp.src('style.scss')
			.pipe(sass())
			.pipe(gulp.dest('css/'))		
	})
	gulp.task('server',function(){
		gulp.watch('style.scss',["sass"])
		gulp.src('./')
		.pipe(serve({
			livereload: true,
	      directoryListing: true,
	      open: true
		}))
	})

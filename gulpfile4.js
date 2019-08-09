var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var open = require("open");

var rev = require("gulp-rev");  //给文件名添加哈希码值
var revReplace = require("gulp-rev-replace");   //更新index的引用
var useref = require("gulp-useref");    //通过注释合并index外部引用
var filter = require ("gulp-filter");   //过滤，筛选 + 恢复

var app = {
    srcPath: "src/",    // 源代码位置
    devPath: "build/",  // 整合之后的代码（开发）
    prdPath: "dist/"    // 用于生产部署（压缩后）（生产）
};

gulp.task('html', function(){
    gulp.src(app.srcPath + 'index.html')
        .pipe(gulp.dest(app.devPath))
        .pipe(gulp.dest(app.prdPath))
        .pipe($.connect.reload());
});

gulp.task('build-html', function () {
    return gulp.src(app.srcPath + 'app/**/*.html')
        .pipe($.htmlmin())
        .pipe($.ngHtml2js({
            moduleName: 'stuApp'
        }))
        .pipe($.concat('template.tpl.js'))
        .pipe(gulp.dest(app.devPath + '/js'));
});

gulp.task('json', function(){
    gulp.src(app.srcPath + 'data/**/*.json')
        .pipe(gulp.dest(app.devPath + "data"))
        .pipe($.connect.reload());
});
gulp.task("lib",function(){
    gulp.src(app.srcPath + "lib/**/*")
        .pipe(gulp.dest(app.devPath + "lib"))
        .pipe($.connect.reload());
});
gulp.task('image', function() {
    gulp.src(app.srcPath + 'images/**/*')
        .pipe(gulp.dest(app.devPath + 'images'))
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'images'))
        .pipe($.connect.reload());
});

gulp.task('css', function(){
    gulp.src(app.srcPath + 'style/**/*.css')
        .pipe($.concat('index.css'))
        .pipe(gulp.dest(app.devPath + "css"))
        .pipe($.connect.reload());
    gulp.src(app.srcPath + 'lib/css/color.css')
        .pipe(gulp.dest(app.devPath + "css"))
        .pipe(gulp.dest(app.prdPath + "css"))
        .pipe($.connect.reload());
});
gulp.task('less', function(){
    gulp.src(app.srcPath + 'less/**/*.less')
        .pipe($.less())
        .pipe($.concat('main.css'))
        .pipe(gulp.dest(app.devPath + "css"))
        .pipe($.connect.reload());
});
gulp.task('js', function(){
    gulp.src([
        app.srcPath + 'app/**/*.module.js',
        app.srcPath + 'app/**/*.js'
    ])
        .pipe($.plumber())
        .pipe($.ngAnnotate({single_quotes: true}))
        .pipe($.concat('index.js'))
        .pipe(gulp.dest(app.devPath + "js"))
        .pipe($.connect.reload());
});
gulp.task('layer', function() {
    gulp.src(app.srcPath + 'lib/js/layer/**/*')
        .pipe(gulp.dest(app.devPath + 'js/layer'))
        .pipe($.connect.reload());
});

gulp.task("indexRev",function(){
    var jsFilter = filter("**/*.js",{restore: true});
    var cssFilter = filter("**/*.css",{restore: true});
    var indexHtmlFilter = filter(["**/*", "!**/index.html"],{restore: true});
    return gulp.src("build/index.html")
        .pipe(useref())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.cssmin())
        .pipe(cssFilter.restore)
        .pipe(indexHtmlFilter)
        .pipe(rev())
        .pipe(indexHtmlFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest("dist"))
        .pipe($.connect.reload());
});
gulp.task('layerRev', function() {
    gulp.src(app.srcPath + 'lib/js/layer/skin/**/*')
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'js/skin'))
});
gulp.task('fonts', function(){
    gulp.src([
        app.srcPath + 'lib/css/fonts/**/*',
        app.srcPath + 'lib/css/font-awesome/fonts/**/*'
    ])
    .pipe(gulp.dest(app.prdPath + 'fonts'))
});

gulp.task('img', function() {
    gulp.src(app.devPath + 'lib/img/**/*')
        .pipe($.imagemin())
        .pipe(gulp.dest(app.prdPath + 'img'))
});

gulp.task('build',['image', 'js','fonts', 'css', 'less', 'lib', 'html', 'json', 'layer', 'build-html']);

gulp.task('clean', function() {
    gulp.src([app.devPath, app.prdPath])
        .pipe($.clean());
});

gulp.task('serve',['build'], function() {
    $.connect.server({
        root: [app.devPath],
        livereload: true,
        port: 8083
    });
    open('http://localhost:8070/stu_shenzhi/openx_space/build');
    gulp.watch(app.srcPath + 'lib/**/*',['lib']);
    gulp.watch(app.srcPath + '**/*.html',['html', 'build-html']);
    gulp.watch(app.srcPath + 'data/**/*.json',['json']);
    gulp.watch(app.srcPath + 'app/**/*.js',['js']);
    gulp.watch(app.srcPath + 'images/**/*',['image']);
    gulp.watch(app.srcPath + 'style/**/*',['css']);
    gulp.watch(app.srcPath + 'less/**/*',['less']);
});

gulp.task('default',['img', 'indexRev', 'layerRev']);




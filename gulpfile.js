"use-strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    csso = require("gulp-csso"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    size = require("gulp-size"),
    server = require("browser-sync"),
    clean = require("gulp-clean"),
    mqpacker = require("css-mqpacker"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    svgmin = require("gulp-svgmin"),
    svgSprite = require("gulp-svg-sprite"),
    run = require("gulp-sequence"),
    del = require("del"),
    uglifyjs = require("gulp-uglifyjs"),
    cheerio = require("gulp-cheerio"),
    replace = require("gulp-replace");

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		style: 'build/style/',
		img: 'build/img/',
		fonts: 'build/fonts/',
        assets : 'build/assets/'
  },
  src: {
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.{png,jpg,gif}',
		fonts: 'src/fonts/**/*.*',
		svgIcons: 'src/img/sprite/*.svg',
        assets:  'src/assets/**.*'
  },
  watch: {
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.{png,jpg,gif}',
		fonts: 'src/fonts/**/*.*',
		svgIcons: 'src/img/sprite/*.svg'
  },
	clean: './build'
};


/*
 assets task
*/

gulp.task('assets:build', function () {
    gulp.src(path.src.assets)
        .pipe(gulp.dest(path.build.assets))
});

/*
	Default task
*/


gulp.task("default", function(fn) {
	run("clean", "build", "watch", fn);
});



/*
	Build task
*/


gulp.task("build", function(fn) { //run для последовательного выполнения, иначе асинхронное
	run(
		"html:build",
		"js:build",
		"style:build",
		"fonts:build",
		"image:build",
		"svgIcons:build",
        "assets:build",
		fn);
});


/*
	Html task
*/


gulp.task("html:build", function() {
	gulp.src(path.src.html)
	.pipe(plumber())
	.pipe(gulp.dest(path.build.html))
	.pipe(server.reload({stream: true}));
});


/*
	Style task
*/


gulp.task("style:build", function() {
  gulp.src(path.src.style)
  .pipe(plumber())
	.pipe(sass())
	.pipe(postcss([
		autoprefixer({browsers: [
			"last 3 version",
			"last 2 Chrome version",
			"last 2 Opera version",
			"last 2 Firefox version",
			"last 2 Edge version"
		]}),
		mqpacker({
			sort: true
		})
	]))
	.pipe(gulp.dest(path.build.style))
	.pipe(csso())
	.pipe(rename("main.min.css"))
	.pipe(gulp.dest(path.build.style))
	.pipe(server.reload({stream: true}));
});


/*
	JS task
*/


gulp.task("js:build", function() {
	gulp.src(path.src.js)
	.pipe(plumber())
	.pipe(uglifyjs())
	.pipe(gulp.dest(path.build.js))
	.pipe(server.reload({stream: true}));
});


/*
	JS task
*/


gulp.task("fonts:build", function() {
	gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts));
});


/*
	Image task
*/


gulp.task("image:build", function() {
	gulp.src(path.src.img)
	.pipe(imagemin([
		imagemin.optipng({optimizationLever: 3}),
		imagemin.jpegtran({proggressive: true})
	]))

	.pipe(gulp.dest(path.build.img));
});


/*
	Icons-svg task
*/


gulp.task("svgIcons:build", function() {
    gulp.src('src/img/sprite/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio(function ($) {
            $('[fill]').removeAttr('fill');
            $('[style]').removeAttr('style');
        }))
        .pipe(replace("&gt;", ">"))
        .pipe(svgSprite( config = {
            spacing : {
                paddiong: 5
            },
            svg : {
                xmlDeclaration: false,
                doctypeDeclaration: false,
                dimensionAttributes: false
            },
            mode : {
                symbol : true,
                css : {
                    render : {
                        scss : true
                    }

                }
            }

            }))
        .pipe(gulp.dest('src/img/sprite/'));
});


/*
	Clear task
*/

gulp.task("clean", function(){
	return del(path.clean);
});


/*
	Watch task
*/


gulp.task("watch", function() {
	server.init({
		server: "build"
	});

	gulp.watch(path.watch.style, ["style:build"]);
	gulp.watch(path.watch.html, ["html:build"]);
	gulp.watch(path.watch.img, ["image:build"]);
	gulp.watch(path.watch.js, ["js:build"]);
	gulp.watch(path.watch.svgIcons, ["svgIcons:build"]);
});





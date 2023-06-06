"use strict"

const {src,dest} = require("gulp");
const gulp = require("gulp");
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const sass = require("gulp-sass")(require("sass"));
const del = require("del");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify")
const browserSync = require("browser-sync");
const rigger = require("gulp-rigger");

const srcPath = "src/"
const distPath = "dist/"

const path = {
    build: {
        html:  distPath,
        css:   distPath + "assets/css/",
        js:    distPath + "assets/js/",
        image: distPath + "assets/image/",
        fonts: distPath + "assets/fonts/",
        pages: distPath + "assets/pages/"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/scss/*.scss",
        js: srcPath + "assets/js/*.js",
        image: srcPath + "assets/image/**/*.{png, jpg, jpeg, svg, gif, webp, ico, xml, json, webmanifest}",
        fonts: srcPath + "assets/fonts/**/*.{eot, woff, woff2, ttf, svg}",
        pages: srcPath + "assets/pages/*.html"
    },
    watch: {
        html:  srcPath + "**/*.html",
        css:   srcPath + "assets/scss/**/*.scss",
        js:    srcPath + "assets/js/**/*.js",
        image: srcPath + "assets/image/**/*.{png, jpg, jpeg, svg, gif, webp, ico, xml, json, webmanifest}",
        fonts: srcPath + "assets/fonts/**/*.{eot, woff, woff2, ttf, svg}",
        pages: srcPath + "assets/pages/**/*.html"
    },
    clean:  "./" + distPath
}

    function html() {
        return src(path.src.html, {base: srcPath})
            .pipe(plumber())
            .pipe(dest(path.build.html))
            .pipe(browserSync.reload({stream: true}))
}
function css() {
    return src(path.src.css, {base: srcPath + "assets/scss/"})
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "CSS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit("end");
            }
        }))
        .pipe(sass({
            includePaths: "./node_modules"
        }))
        .pipe(concat("style.css"))
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zIndex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}))
}
function pages() {
    return src(path.src.pages, {base: srcPath + "assets/pages/"})
        .pipe(plumber())
        .pipe(dest(path.build.pages))
        .pipe(browserSync.reload({stream: true}))
}

function js() {
    return src(path.src.js, {base: srcPath + "assets/js/"})
        .pipe(plumber({
            errorHandler: function(err) {
                notify.onError({
                    title: "JavaScrip Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit("end");
            }
        }))
        .pipe(rigger())
        .pipe(concat("main.js"))
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
            extname: ".js"
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))
}

function image() {
    return src(path.src.image, {base: srcPath + "assets/image/"})
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest(path.build.image))
        .pipe(browserSync.reload({stream: true}))
}
function fonts() {
    return src(path.src.fonts, {base: srcPath + "assets/fonts/"})
        .pipe(browserSync.reload({stream: true}))
}
function clean() {
    return del(path.clean)
}
function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.image], image)
    gulp.watch([path.watch.fonts], fonts)
}
function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

const build = gulp.series(clean, gulp.parallel(html, pages, css, js, image, fonts))
const watch = gulp.parallel(build, watchFiles, serve)

exports.html = html
exports.css = css
exports.js = js
exports.image = image
exports.fonts = fonts
exports.pages = pages
exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = watch


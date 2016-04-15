var gulp = require('gulp');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var csscomb = require('gulp-csscomb');
var cssmin = require('gulp-csso');
var rename = require('gulp-rename');
var webpack = require('gulp-webpack');
var browserSync = require('browser-sync').create();

var paths = {
    scripts: 'src/js/*.js',
    jsx: 'src/app/**/*.jsx',
    styles: 'src/stylus/**.styl'
};

gulp.task('uglify', function () {
    return gulp.src(paths.scripts)
        .pipe(uglify({mangle: true, compress: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./assets/js'))
        .pipe(browserSync.stream());
});

gulp.task('react', function() {
    return gulp.src('src/app/Root.jsx')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('stylus', function () {
    return gulp.src('src/stylus/style.styl')
        .pipe(stylus())
        .pipe(csscomb())
        .pipe(gulp.dest('./assets/css'))
        .pipe(cssmin())
        .pipe(rename({
            basename: 'style',
            suffix: '.min',
            ext: '.css'
        }))
        .pipe(gulp.dest('./assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch(paths.jsx, ['react']);
    gulp.watch(paths.scripts, ['uglify']);
    gulp.watch(paths.styles, ['stylus']);
});

gulp.task('default', ['browser-sync', 'react', 'uglify', 'stylus', 'watch']);

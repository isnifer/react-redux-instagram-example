var gulp = require('gulp');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var csscomb = require('gulp-csscomb');
var cssmin = require('gulp-csso');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var react = require('gulp-react');

var paths = {
    scripts: 'src/js/*.js',
    jsx: 'src/jsx/*.jsx',
    styles: 'src/stylus/**.styl'
};

gulp.task('uglify', function () {
    return gulp.src(paths.scripts)
        .pipe(uglify({mangle: true, compress: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./assets/js'))
        .pipe(livereload());
});

gulp.task('jsx', function () {
    return gulp.src(paths.jsx)
        .pipe(react())
        .pipe(gulp.dest('./assets/components'))
        .pipe(uglify({mangle: false, compress: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./assets/components'))
        .pipe(livereload());
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
        .pipe(livereload());
});

gulp.task('watch', function() {
    var server = livereload();
    gulp.watch('./*.html').on('change', function (file) {
        server.changed(file.path);
    });
    gulp.watch(paths.scripts, ['uglify']);
    gulp.watch(paths.jsx, ['jsx']);
    gulp.watch(paths.styles, ['stylus']);
});

gulp.task('default', ['uglify', 'jsx', 'stylus', 'watch']);

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    csscomb = require('gulp-csscomb'),
    cssmin = require('gulp-csso'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload');

var paths = {
    scripts: './src/js/*.js',
    styles: './src/stylus/**.styl'
};

gulp.task('uglify', function () {
    return gulp.src(paths.scripts)
        .pipe(uglify({mangle: true, compress: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./assets/js'))
        .pipe(livereload());
});

gulp.task('stylus', function () {
    return gulp.src('./src/stylus/style.styl')
        .pipe(stylus({use: ['nib']}))
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
    gulp.watch(paths.styles, ['stylus']);
});

gulp.task('default', ['watch']);
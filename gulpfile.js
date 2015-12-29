var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')({
    lazy: true
});
var browserSync = require('browser-sync');

var config = require('./gulp.config');

var lessFiles = config.lessFiles;
var dist = './dist/';
var distFiles = dist + '**/*.*';

gulp.task('bower', function () {
    gulp.src('./test/index-test.html')
        .pipe(wiredep())
        .pipe(gulp.dest('./test'));
});

gulp.task('build-typescript', function () {
    return gulp.src(config.typescript, {base:'src'})
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
            target: 'ES5',
            out: 'framework.js'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build-less', function () {
    return gulp.src([lessFiles])
        .pipe($.less())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-typescript', function () {
    gulp.watch(config.typescript, ['build-typescript']);
});

gulp.task('watch-less', function () {
    gulp.watch(lessFiles, ['build-less']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: './',
        index: 'test/index-test.html',
        port: 4000,
        files: ['./dist/*', './test/index-test.html', './test/app.js']
    });
});

gulp.task('watch', ['watch-typescript', 'watch-less', 'browser-sync'], function () {

});

gulp.task('serve', ['build-typescript','build-less', 'watch'], function () {

});

gulp.task('9GaggerLocator-copy', function () {
    return gulp.src(distFiles)
        .pipe(gulp.dest('../VisualStudio/9GaggerLocator/9GaggerLocator/public/scripts'));
});
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});
var browserSync = require('browser-sync');

var config = require('./gulp.config');

var typescriptFiles = './src/**/*.ts';
var lessFiles = config.lessFiles;
var dist = './dist/';
var distFiles = dist + '**/*.*';

gulp.task('build-client-typescript', function () {
 return gulp.src(config.typescript.client)
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
            target: 'ES5',
            out: 'framework.client.js'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build-server-typescript', function () {
 return gulp.src(config.typescript.server)
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
            target: 'ES5',
            out: 'framework.server.js'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build-typescript', function () {
    return gulp.src([typescriptFiles,
        //TMP exclude services for the client side library, they are only required for a server side library that can access the file system
        '!' + './src/services/**/*.ts',
        './typings/**/*.d.ts'])
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
            target: 'ES5',
            out: 'framework.js'
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build-services', function () {
    return gulp.src([
        './src/server/services/**/*.ts',
        './typings/**/*.d.ts'])
        .pipe($.typescript({
            target: 'ES5',
            out: 'services.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build-less', function () {
    return gulp.src([lessFiles])
        .pipe($.less())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-typescript', function () {
    gulp.watch(typescriptFiles, ['build-typescript']);
});

gulp.task('watch-less', function () {
    gulp.watch(lessFiles, ['build-less']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: './',
        index: 'test/index-test.html',
        port: 4000,
        files: ['./dist/*', './test/index-test.html']
    });
});

gulp.task('watch', ['watch-typescript', 'watch-less', 'browser-sync'], function () {

});

gulp.task('9GaggerLocator-copy', function () {
    return gulp.src(distFiles)
        .pipe(gulp.dest('../VisualStudio/9GaggerLocator/9GaggerLocator/public/scripts'));
});
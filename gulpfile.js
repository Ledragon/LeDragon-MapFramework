var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});
var browserSync = require('browser-sync');


var typescriptFiles = './src/**/*.ts';
var dist = './dist/';
var distFiles = dist + '**/*.*';

gulp.task('build-typescript', function () {
    return gulp.src([typescriptFiles,
        //TMP exclude services for the client side library, they are only required for a server side library that can access the file system
        '!' + './src/services/**/*.ts',
        './typings/**/*.d.ts'])
        .pipe($.tsc({
        target: 'ES5',
        out: 'framework.js',
        declaration: true,
        sourceMap: false
    }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-typescript', function () {
    gulp.watch(typescriptFiles, ['build-typescript']);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: './',
        index: 'index-test.html',
        port: 4000,
        files: ['./dist/*', 'index-test.html']
    });
});

gulp.task('9GaggerLocator-copy', function () {
    return gulp.src(distFiles)
        .pipe(gulp.dest('../VisualStudio/9GaggerLocator/9GaggerLocator/public/scripts'));
});
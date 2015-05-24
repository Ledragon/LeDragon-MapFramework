var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});
var browserSync = require('browser-sync');


var typescriptFiles = './src/**/*.ts';

gulp.task('build-typescript', function () {
    return gulp.src([typescriptFiles, './typings/**/*.d.ts'])
        .pipe($.tsc({
            target: 'ES5',
            out: 'framework.js',
            declaration: true,
            sourceMap: false
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-typescript', function () {
    gulp.watch(typescriptFiles, ['build-typescript', browserSync.reload]);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: './',
        index:'index-test.html',
        port: 4000,
        files:['./dist/*','index-test.html']
    });
    
})
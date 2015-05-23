var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    lazy: true
});

var typescriptFiles = './src/**/*.ts'

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
    gulp.watch(typescriptFiles, ['build-typescript']);
});
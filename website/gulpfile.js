var gulp = require('gulp');
var browserSync = require('browser-sync');

// Static server
gulp.task('default', function() {
    browserSync({
        server: {
            baseDir: "./public/"
        }
    });
});
// Gulp Stuff
const gulp = require("gulp");
const gutil = require('gulp-util');

// Watch
gulp.task('watch-server', function () {
    // Source Watch
    gulp.watch('source/**/**', ["watch:server"]);
    gulp.watch('data/**/*', ["data"]);
    gutil.log(gutil.colors.green("Watch is running"));

    return Promise.resolve();
});


gulp.task("watch:server", gulp.series("compile-server", "start-server", done => done()));

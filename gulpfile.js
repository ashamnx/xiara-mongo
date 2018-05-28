const gulp = require('gulp');
const gutil = require('gulp-util');

// Load Tasks
require('./tasks/cleanup.js');
require('./tasks/compile-server.js');
require('./tasks/start-server-process.js');
require('./tasks/watch.js');

gulp.task('compile', gulp.series('compile-server', done => done()));
gulp.task('lift', gulp.series('cleanup', 'compile', 'watch-server', 'start-server', done => done()));
gulp.task('lift-server', gulp.series('cleanup', 'compile', 'watch-server', 'start-server', done => done()));

const help = gulp.task('help', (done) => {
    gutil.log(gutil.colors.cyan('Available Commands:'));
    gutil.log(gutil.colors.cyan('	- lift (Starts the webserver & watches without opening the browser)'));
    gutil.log(gutil.colors.cyan('	- compile (Compiles the source files + copies the assets)'));
    gutil.log(gutil.colors.cyan('	- help (Displays the current help)'));
    done();
});

gulp.task('default', help);
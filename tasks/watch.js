// Gulp Stuff
var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Watch
gulp.task('watch-server', function()
{
	// Source Watch
	gulp.watch('source/**/**', ["watch:server"]);
	gulp.watch('data/**/*', ["data"]);
	gutil.log(gutil.colors.green("Watch is running"));

	return Promise.resolve();
});



gulp.task("watch:server", function(done)
{
	runSequence("compile-server", "start-server", done);
})

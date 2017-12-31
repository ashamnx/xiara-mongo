var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Load Tasks
require("./tasks/compile-server.js");
require("./tasks/start-server-process.js");
require("./tasks/cleanup.js");
require("./tasks/watch.js");

// Compile Backend & Frontend & Copy Assets
gulp.task("compile", function(done)
{
	runSequence("compile-server", done);
});

gulp.task("lift", function(done)
{
	runSequence("cleanup", "compile", 'watch-server', 'start-server', done);
});


gulp.task("lift-server", function(done)
{
	runSequence("cleanup", "compile", 'watch-server', 'start-server', done);
});

gulp.task('help', function() {
	gutil.log(gutil.colors.cyan("Available Commands:"));
	gutil.log(gutil.colors.cyan("	- lift (Starts the webserver & watches without opening the browser)"));
	gutil.log(gutil.colors.cyan("	- compile (Compiles the source files + copies the assets)"));
	gutil.log(gutil.colors.cyan("	- help (Displays the current help)"));
  return;
});

gulp.task('default', ["help"]);
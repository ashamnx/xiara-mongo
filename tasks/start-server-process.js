var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Server Process
var child = require('child_process');

let options = process.argv.slice(3);
options.unshift("./main.js");


// Manage Server Process
let ServerProcess = null;
gulp.task("start-server", function (done)
{
	
	if(ServerProcess != null)
	{
		gutil.log(gutil.colors.magenta("[Process]"), gutil.colors.red('Stopping server Process'));
		ServerProcess.kill("SIGKILL");
	}

	

	gutil.log(gutil.colors.magenta("[Process]"), gutil.colors.green('Starting server Process:'), options);
	ServerProcess = child.spawn("node", options, {cwd: "./build/", stdio: [process.stdin, process.stdout, process.stderr, 'pipe']});
	done();
});
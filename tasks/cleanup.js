// Gulp Stuff
var gulp = require("gulp");
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

// Custom Imports
var clean = require('gulp-clean');

// Tasks
gulp.task("cleanup", function () {
	return gulp.src('build/', {read: false})
	.pipe(clean({force: true}));
});

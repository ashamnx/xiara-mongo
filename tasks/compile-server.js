var gulp = require("gulp");
var gutil = require('gulp-util');
var typescript = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var tsify = require('tsify');
var runSequence = require('run-sequence');


gulp.task("compile-server", function(done)
{
	runSequence("compile-backend:source", done);
})

const serverProject = typescript.createProject("./tsconfig.json", {declaration: true});

// Compile full bundle Chess + Chessboard
gulp.task("compile-backend:source", function ()
{
	var tsResults = gulp.src("source/**/*.ts")
	.pipe(sourcemaps.init())
	.pipe(serverProject());

	 return merge([
        tsResults.dts.pipe(gulp.dest('./build/')),
        tsResults.js.pipe(sourcemaps.write('./')).pipe(gulp.dest('./build/'))
	 ]);
});

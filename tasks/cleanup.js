// Gulp Stuff
const gulp = require("gulp");

// Custom Imports
const clean = require("gulp-clean");

// Tasks
gulp.task("cleanup", () =>
    gulp.src("build/", {read: false}).pipe(clean({force: true}))
);

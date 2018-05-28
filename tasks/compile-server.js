const gulp = require("gulp");
const typescript = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge2');

const serverProject = typescript.createProject("./tsconfig.json", {declaration: true});

// Compile full bundle Chess + Chessboard
gulp.task("compile-backend:source", function () {
    const tsResults = gulp.src("source/**/*.ts")
        .pipe(sourcemaps.init())
        .pipe(serverProject());

    return merge([
        tsResults.dts.pipe(gulp.dest('./build/')),
        tsResults.js.pipe(sourcemaps.write('./')).pipe(gulp.dest('./build/'))
    ]);
});

gulp.task("compile-server", gulp.series("compile-backend:source", done => done()));

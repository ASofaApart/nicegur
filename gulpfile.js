var gulp = require("gulp");
var ts = require("gulp-typescript");
var tslint = require("gulp-tslint");
var tsd = require("gulp-tsd");

var tslintconfig = {
    configuration: {
        rules: {
            semicolon: true,
            curly: true,
            typedef: [
                true,
                "call-signature",
                "parameter",
                "property-declaration",
                "variable-declaration",
                "member-variable-declaration"
            ]
        }
    },
    emitError: false
};


gulp.task("build", ["ts"]);

gulp.task("watch", function(cb){
    gulp.watch("./ts/**/*.ts", ["ts"])
});

gulp.task("tsd", function(cb){
    tsd({
        command: "reinstall",
        config: "./tsd.json"
    }, cb);
});

gulp.task("tslint", function(){
    return gulp.src("./ts/**/*.ts")
        .pipe(tslint(tslintconfig))
});

function doTS(){
    return gulp.src("./ts/**/*.ts")
        .pipe(ts({
            module: "commonjs"
        }))
        .pipe(gulp.dest("./js/"))
}

gulp.task("ts-only", doTS);

gulp.task("ts", ["tsd", "tslint"], doTS);
var dev = true;
var debug = false;

//CSS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-cssnano');

//JS
var jshint = require('gulp-jshint');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

//General
var gulp = require('gulp');
var fs = require('fs');
var browserSync = require('browser-sync');
var header  = require('gulp-header');
var rename = require('gulp-rename');
var notify = require("gulp-notify");
var gutil = require('gulp-util');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var debug = require('gulp-debug');
var rm = require('gulp-rimraf');

//Packaging
var crx = require('gulp-crx-pack');
var zip = require('gulp-zip');
var manifest = require('./build/manifest.json');

var package = require('./package.json');
    module.exports = gulp;
//////////////////////////////////////////////////////////////////


var config = {
  threshold: '1kb'
};
var src = {
    root    : "src",
    markup : "./src/*.html",
    scripts: "src/scripts/*.js",
    json: "src/*.json",
    typescripts     : "src/scripts/*.tsx",
    styles : "src/styles/*.scss",
    images : "src/images/*",
    fonts  : "src/fonts/*"
};
var dest = {
    root   : "build/",
    markup: "build/*.html",
    index : "build/onetab.html",
    scripts: "build/js/",
    styles: "build/css/",
    images: "buildimages/",
    fonts : "build/fonts/"
};
// var excludeHTML = 

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

gulp.task('crx', function() {
  var codebase = manifest.codebase;
  var updateXmlFilename = 'update.xml';
  return gulp.src('build')
    .pipe(crx({
      privateKey: fs.readFileSync('./certs/key.pem', 'utf8'),
      filename: manifest.name + '.crx',
      codebase: codebase,
      // updateXmlFilename: updateXmlFilename
    }))
    .pipe(gulp.dest('./dist'));
});
gulp.task('zip', function() {
    return gulp.src(['build/*','certs/key.pem'])
        .pipe(zip(manifest.name + '.zip'))
        .pipe(gulp.dest('./dist'));
});
gulp.task('html', function () {
    debugger;
    return gulp.src(src.markup)
    .on('error',console.error.bind(console))
    .pipe(debug({title: 'HTML:'}))
    .pipe(gulp.dest(dest.root))
    .pipe(notify({title: package.name+' Message',message: "HTML loaded"}))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('img', function () {
    return gulp.src(src.images)
    .on('error',console.error.bind(console))
    .pipe(debug({title: 'IMG:'}))
    // .pipe(gzip(config))
    .pipe(gulp.dest(dest.images))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('css', function () {
    console.log("CSS");
    return gulp.src(src.styles)
    .pipe(plumber())
    .on('error',console.error.bind(console))
    .pipe(debug({title: 'CSS:'}))
    // .pipe(sourcemaps.init())
    .pipe(sass({
            errLogToConsole: true,
            //outputStyle: 'compressed',
            // outputStyle: 'compact',
            outputStyle: 'nested',
            // outputStyle: 'expanded',
            precision: 10
     }).on('error', gutil.log))
    // .pipe(sourcemaps.write({includeContent: false}))
    .pipe(autoprefixer('last 4 version', '> 1%', 'safari 4', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest(dest.styles)).on('error', gutil.log)
    // .pipe(minifyCSS({
    //     postcssDiscardUnused: false,
    //     postcssZindex: false,
    //     postcssDiscardEmpty: true,
    //     postcssMergeRules: false
    // })).on('error', gutil.log)
    // .pipe(rename({suffix :".min" }))
    .pipe(gulp.dest(dest.styles)).on('error', gutil.log)
    .pipe(notify({title: package.name+' message',message: "CSS loaded"})).on('error', gutil.log)
    .pipe(browserSync.reload({stream:true}));
});


gulp.task('js',function(){
    return gulp.src(src.scripts)
    .on('error',console.error.bind(console))
    .pipe(debug({title: 'JS:'}))
    .pipe(jshint('.jshintrc').on('error', gutil.log))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest(dest.scripts))
    .pipe(notify({title: package.name+' Message',message: "HTML loaded"}))
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(src.scripts))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('json',function(){
    return gulp.src(src.json).pipe(gulp.dest(dest.root));

});
gulp.task('ts',function(){
    return gulp.src(src.typescripts)
    .pipe(debug({title: 'Typescript:'}))
    .pipe(tsProject())
    .pipe(gulp.dest(dest.scripts))
});

gulp.task('start-browsersync', function() {
    browserSync.init({
        server: {
            baseDir: ".",
            middleware: function (req, res, next) {
            res.setHeader('Accept', '*/*');            
            res.setHeader('Access-Control-Allow-Origin', '*');
            next();
            }
            , index: "build/onetab.html"
        },
        online:true
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});
gulp.task('watch',function(){
    gulp.watch(src.markup,  ['html','crx','zip']);
    gulp.watch(src.styles, ['css']);
    gulp.watch(src.scripts, ['js','crx','zip']);
    gulp.watch(src.typescripts, ['ts','crx','zip']);
    gulp.watch(src.images, ['img','crx','zip']);
    gulp.watch(src.json, ['json','crx','zip']);
    gulp.watch([
        dest.markup //error here
        ,dest.styles
        ,dest.images
        ,dest.scripts
        ], ['bs-reload']);
})
gulp.task('default', ['watch','json','crx','zip','html','css','js','ts','start-browsersync']);


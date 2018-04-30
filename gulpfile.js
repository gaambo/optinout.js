const gulp = require('gulp');
const gulpUglify = require('gulp-uglify/composer');
const uglifyEs = require('uglify-es');
const path = require('path');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
//const rollup = require('gulp-rollup');
const rollupStream = require('rollup-stream'); 
const source = require('vinyl-source-stream');
const pkg = require('./package.json'); 
const rollup = require('rollup'); 
const rollupConfig = require('./config/rollup');
const del = require('del'); 

const uglify = gulpUglify(uglifyEs, console); 

gulp.task('default', ['clean', 'build'], () => {
  return true; 
}); 

gulp.task('build', ['clean', 'rollup', 'minify'], () => {
  return true; 
});

gulp.task('clean', () => {
  return del(['dist/**/*']);
});

gulp.task('rollup', ['clean', 'rollup-iife', 'rollup-umd', 'rollup-common-module', 'rollup-es-module'], () => {
  return true; 
});

gulp.task('rollup-iife', ['clean'], () => {
  let config = rollupConfig[0]; 
  config.rollup = rollup; //newer rollup version 
  return rollupStream(config)
    .pipe(source(path.basename(config.file)))
    .pipe(gulp.dest('./dist'));
});

gulp.task('rollup-umd', ['clean'], () => {
  let config = rollupConfig[1]; 
  config.rollup = rollup; //newer rollup version 
  return rollupStream(config)
    .pipe(source(path.basename(config.file)))
    .pipe(gulp.dest('./dist'));
});

gulp.task('rollup-common-module', ['clean'], () => {
  let config = rollupConfig[2]; 
  config.rollup = rollup; //newer rollup version 
  return rollupStream(config)
    .pipe(source(path.basename(config.file)))
    .pipe(gulp.dest('./dist'));
});

gulp.task('rollup-es-module', ['clean'], () => {
  let config = rollupConfig[3]; 
  config.rollup = rollup; //newer rollup version 
  return rollupStream(config)
    .pipe(source(path.basename(config.file)))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify', ['rollup'], () => {
  return gulp.src(['./dist/**/*.js', '!./dist/**/*.min.js'], { base: '.'})
    .pipe(plumber())
    .pipe(uglify({
      output: {
        beautify: false, 
        preamble: `/* ${pkg.name} - v${pkg.version} | Copyright: ${pkg.author} and other contributors | License: https://gitlab.com/optinout/optinout.js */`
      }
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('./'));
}); 
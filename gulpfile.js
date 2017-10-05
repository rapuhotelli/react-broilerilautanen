const gulp = require('gulp');
const path = require('path');
const del = require('del');
const gutil = require('gulp-util');

// CSS
const sass = require('gulp-sass');
const minifyCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps'); // sass sourcemaps
const flatten = require('gulp-flatten');

// JS
const webpack = require('webpack');
const eslint = require('gulp-eslint');

const paths = {
  styleEntry: 'src/sass/main.scss',
  scriptEntry: 'src/jsx/index.jsx',
  outPoint: path.join.apply(null, [__dirname, 'dist']),
};

const imports = {
  sass,
  minifyCss,
  sourcemaps,
  flatten,
  webpack,
  gutil,
  eslint,
};

const env = (process.env.NODE_ENV || 'development');
const options = require(`./gulp.${env}.js`)(gulp, paths, imports);

// Code Quality
// Your editor should lint appropriately through the same .eslintrc
// but let's enforce it here, for good measure
gulp.task('lint', () => gulp.src('src/jsx/**/*.jsx')
      .pipe(eslint())
      .pipe(eslint.format('table', process.stderr))
      .pipe(eslint.failOnError()));

// Delete dist/* before every build
gulp.task('purge', () => del(['dist/*']));

// Sass build
gulp.task('sass', () => options.sass());

// JS build
gulp.task('webpack', callback => options.webpack(callback));

// Watch Files For Changes
gulp.task('watch', () => {
  gulp.watch('src/jsx/**/*.jsx', ['lint', 'webpack']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['build', 'watch']);
gulp.task('build', ['lint', 'purge', 'sass', 'webpack']); // delete only after lint is fine

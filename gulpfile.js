
// Basics
const gulp = require('gulp');
const path = require('path');

// CSS
const sass = require('gulp-sass');
const minifyCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps'); // sass sourcemaps
const flatten = require('gulp-flatten');

// JS
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');

const styleEntry = 'src/sass/main.scss';
const scriptEntry = 'src/jsx/index.jsx';
const buildPath = [__dirname, 'app', 'static', 'build'];
const outPoint = path.join.apply(null, buildPath);

// Code Quality
// Your editor should lint appropriately through the same .eslintrc
// but let's enforce it here, for good measure
gulp.task('lint', () => gulp.src('src/jsx/**/*.jsx')
      .pipe(eslint())
      .pipe(eslint.format('table', process.stderr))
      .pipe(eslint.failOnError()));

gulp.task('sass', () => gulp.src(styleEntry, { base: __dirname })
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(minifyCss())
      .pipe(sourcemaps.write('.', { includeContent: false }))
      .pipe(flatten())
      .pipe(gulp.dest(outPoint)));

gulp.task('scripts', () => gulp.src(scriptEntry)
      .pipe(webpack({
        plugins: [
          new webpack.webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: { warnings: false },
          }),
        ],
        devtool: 'source-map',
        module: {
          loaders: [
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              loader: 'babel-loader',

              query: {
                presets: [
                  [
                    'env', { targets: { ie: 11 } },
                  ],
                ],
              },
            },
          ],
        },
        output: {
          filename: 'scripts.js',
        },
      }).on('error', () => { this.emit('end'); }))
      .pipe(gulp.dest(outPoint)));


// Watch Files For Changes
gulp.task('watch', () => {
  gulp.watch('src/jsx/**/*.js', ['lint', 'scripts', 'jsVersion']);
  gulp.watch('src/sass/**/*.scss', ['sass', 'cssVersion']);
});

// Default Task
gulp.task('default', ['build', 'watch']);

gulp.task('build', ['lint', 'sass', 'scripts', 'cssVersion', 'jsVersion']);
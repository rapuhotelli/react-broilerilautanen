const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      inject: false,
      files: {
        js: ['scripts.js'],
      },
    }),
  ],
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|public)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  output: {
    filename: 'scripts.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

module.exports = (gulp, paths, imports) => ({
  sass: () => gulp.src(paths.styleEntry, { base: __dirname })
          .pipe(imports.sourcemaps.init())
          .pipe(imports.sass().on('error', imports.sass.logError))
          .pipe(imports.minifyCss())
          .pipe(imports.sourcemaps.write('.', { includeContent: false }))
          .pipe(imports.flatten())
          .pipe(gulp.dest(paths.outPoint)),

  scripts: () => gulp.src(paths.scriptEntry)
          .pipe(imports.webpack(webpackConfig).on('error', e => console.log(e)))
          .pipe(gulp.dest(paths.outPoint)),
});

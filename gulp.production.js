const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const webpackConfig = {
  plugins: [
    new BabiliPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['main.css'],
        js: ['scripts.js'],
      },
    }),
  ],
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
};

module.exports = (gulp, paths, imports) => ({
  sass: () => gulp.src(paths.styleEntry, { base: __dirname })
          .pipe(imports.sass().on('error', imports.sass.logError))
          .pipe(imports.minifyCss())
          .pipe(imports.flatten())
          .pipe(gulp.dest(paths.outPoint)),

  scripts: () => gulp.src(paths.scriptEntry)
          .pipe(imports.webpack(webpackConfig).on('error', e => console.log(e)))
          .pipe(gulp.dest(paths.outPoint)),
});

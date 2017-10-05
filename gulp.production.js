const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');

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
          presets: ['react'],
        },
      },
    ],
  },
  output: {
    filename: 'scripts.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};

module.exports = (gulp, paths, imports) => ({
  sass: () => gulp.src(paths.styleEntry, { base: __dirname })
          .pipe(imports.sass().on('error', imports.sass.logError))
          .pipe(imports.minifyCss())
          .pipe(imports.flatten())
          .pipe(gulp.dest(paths.outPoint)),

  webpack: (callback) => {
    webpackConfig.entry = `./${paths.scriptEntry}`;
    imports.webpack(webpackConfig, (err, stats) => {
      if (err) throw new imports.gutil.PluginError('webpack', err);
      imports.gutil.log('[webpack]', stats.toString({
        colors: true,
      }));
      callback();
    });
  },

});

var webpack = require('webpack');
var ngToolsWebpack = require('@ngtools/webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var appEnvironment = process.env.APP_ENVIRONMENT || 'development';
var isProduction = appEnvironment === 'production'; 

var webpackConfig = {

  entry: {
    'app': './src/main.ts',
    'polyfills': [
      'core-js/es6',
      'core-js/es7/reflect',
      'zone.js/dist/zone'
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].[hash].js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: isProduction ? '@ngtools/webpack' : 'ts!angular2-template' },
      { test: /\.html$/, loader: 'raw' },
      { test: /\.css$/, loader: 'raw' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallbackLoader: 'style', loader: ['css', 'sass'] }) }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.html', '.css']
  },
  plugins: [
    // see https://github.com/angular/angular/issues/11580
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      './src'
    ),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'polyfills'
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    // new CopyWebpackPlugin([
    //   { from: 'node_modules/ionic-angular/css', to: 'css' },
    //   { from: 'node_modules/ionic-angular/fonts', to: 'fonts' }
    // ]),
    new webpack.DefinePlugin({
      app: {
        environment: JSON.stringify(appEnvironment)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        resolve: {
          // see https://github.com/TypeStrong/ts-loader/issues/283#issuecomment-249414784
        },
        sassLoader: {
          includePaths: [
            __dirname + "/node_modules/ionic-angular"
          ]
        }
      }
    }),
    new ExtractTextPlugin({ filename: '[name].[hash].css' })
  ]
  // devServer: {
  //   stats: 'errors-only'
  // }

};

if (isProduction) {
  webpackConfig.plugins.push(new ngToolsWebpack.AotPlugin({
    tsConfigPath: './tsconfig.json',
    entryModule: './src/app/app.module#AppModule'
  }));
}

module.exports = webpackConfig;
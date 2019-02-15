var path = require("path");

const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const port = process.env.PORT || 8000;
const {GenerateSW} = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


var config = {
  entry: {
    index: path.resolve(__dirname, 'src/app.tsx'),
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },

  plugins: [
    new webpack.EnvironmentPlugin({'NODE_ENV': 'production'}),
    new CleanWebpackPlugin(['dist'], { root: __dirname, verbose: true, dry: false, exclude: [] }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'template.html',
      inject: true,
    }),
		new GenerateSW({
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      navigateFallback: '/template.html'
    })
  ],

  resolve: {
    extensions: [".ts", ".tsx", ".js", "*"],
    modules: [
      "node_modules",
      "src"
    ]
  },

  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  "modules": false,
                  "targets": {
                    "browsers": [">1%"]
                  }
                }
              ]
            ]
          } 
        },
        {
          loader: 'ts-loader'
        }
      ]
    },
    {
      test: /\.(png|jpg|webp|svg|mp3|wav)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "file-loader"
        }
      ]
    }
    ]
  }
};

module.exports = config

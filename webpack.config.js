const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: '[name].bundle.css',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = {
  entry: {
    app: './src/index.js',
    landing: './src/screens/landing_page/index.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      { enforce: 'pre', test: /\.js$/, loader: 'eslint-loader' },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(sass|scss)$/,
        include: path.resolve(__dirname, 'src'),
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer()],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
          loader: 'css-loader',
        }],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
        }],
      },
    ],
  },
  plugins: [
    extractSass,
    new HtmlWebpackPlugin({
      filename: 'app.html',
      template: './src/screens/app_screen/index.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      template: './src/screens/landing_page/index.html',
      chunks: ['landing'],
    }),
    new CopyWebpackPlugin([{
      from: './src/components/utils/library',
      to: './',
    },
    {
      from: './src/screens/landing_page/images&favicon',
      to: './',
    },
    ]),
  ],
};

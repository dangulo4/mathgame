const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

const config = {
  // Entry and Output into our application
  entry: './app/app.js',
  output: {
    filename: 'myBundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new HtmlWebpackPlugin({ template: './app/index.html' })],
  // This will stop the warning message about being in production
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  // Alternative to npx webpack --watch
  //watch: true,

  // This will upload the most recent code in our broweser
  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, 'dist'),
    // This enables hot module replacement in webpack for performance and
    //prevents reload where it injects the latest code to the browser
    hot: true,
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                { useBuiltIns: 'usage', corejs: 3, targets: 'defaults' },
              ],
              '@babel/preset-react',
            ],
          },
        },
      },
    ],
  },
};

if (currentTask == 'build') {
  config.mode = 'production';
  config.module.rules[0].use[0] = MiniCssExtractPlugin.loader;
  config.plugins.push(
    new MiniCssExtractPlugin({ filename: 'main.[hash].css' }),
    new CleanWebpackPlugin(),
    new WebpackManifestPlugin()
  );
}

module.exports = config;

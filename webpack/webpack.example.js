const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const { src_Path, example_Path } = require("./path");
const { selectedPreprocessor } = require("./loader");

module.exports = {
  entry: {
    app: `./${src_Path}/application.ts`,
    'circular-slider': [`./${src_Path}/slider/circular-slider.ts`, `./${src_Path}/slider/circular-slider.scss`],
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    path: path.resolve(__dirname, example_Path),
    filename: "[name].js"
  },
  optimization: {
    minimize: false
  },
  //devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: selectedPreprocessor.fileRegexp,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: selectedPreprocessor.loaderName
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, example_Path), {
      root: process.cwd()
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: `./${src_Path}/index.html`,
      filename: "index.html"
    }),
    new WebpackMd5Hash()
  ]
};

"use strict";

const { resolve } = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const root = resolve(__dirname, "..");

module.exports = {
  mode: "development",
  entry: {
    app: resolve(root, "src/index.ts")
  },
  output: {
    filename: "[name].js",
    path: resolve(root, "dist")
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: resolve(root, "src/index.html"),
    })
  ],
  devServer: {
    contentBase: resolve(root, "dist")
  }
};

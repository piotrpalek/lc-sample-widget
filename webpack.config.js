const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: {
    bundle: ["whatwg-fetch", "./src/main.js"]
  },
  resolve: {
    extensions: [".js", ".html"]
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        //        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "svelte-loader",
            options: {
              skipIntroByDefault: true,
              nestedTransitions: true,
              emitCss: true,
              hotReload: true
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=.+)?$/,
        use: "file-loader"
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ],
  devtool: prod ? false : "source-map",
  devServer: {
    disableHostCheck: true
  }
};
// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const config = {
  entry: {
    common: './client/src/ts/index.ts',
    main: './client/src/ts/main.ts',
    about: './client/src/ts/about.ts',
    login: './client/src/ts/login.ts'
},
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/pages/index.html',
      filename: 'index.html',
      chunks: ['common', 'login']
  }),
  new HtmlWebpackPlugin({
      template: './client/src/pages/main.html',
      filename: 'main.html',
      chunks: ['common', 'main']
  }),
  new HtmlWebpackPlugin({
      template: './client/src/pages/about.html',
      filename: 'about.html',
      chunks: ['common', 'about']
  }),
  new CopyWebpackPlugin({
    patterns: [
      { from: "client/src/assets/", to: "client/assets/" },
    ]
  })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [stylesHandler, "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.html$/i,
        use: "html-loader"
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
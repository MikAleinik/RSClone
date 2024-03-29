// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const { merge } = require('webpack-merge');

const isProduction = process.env.NODE_ENV == "production";
const outDir = isProduction ? "../../../../var/www/html" : "dist";

const stylesHandler = "style-loader";

const config = {
  entry: {
    common: './src/index.ts',
    main: './src/main.ts',
    about: './src/about.ts',
  },
  // moved to ./webpack.dev.config
  output: {
    path: path.resolve(__dirname, outDir),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/pages/index.html',
      filename: 'index.html',
      chunks: ['common', 'index']
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/main.html',
      filename: 'main.html',
      chunks: ['common', 'main']
    }),
    new HtmlWebpackPlugin({
      template: 'src/pages/about.html',
      filename: 'about.html',
      chunks: ['common', 'about']
    }),
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, "src", "assets"), to: path.resolve(__dirname, outDir, "assets") },
        ]
      }),
    new CleanWebpackPlugin()
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
        use: [
          stylesHandler,
          "css-loader",
          "sass-loader",
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                './src/components/view/common/common.scss'
              ]
            },
          },
        ],
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

module.exports = (env, argv) => {
  env;
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
    config.devtool = "inline-source-map";
  }

  const envConfig = isProduction ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(config, envConfig);

  return config;
};
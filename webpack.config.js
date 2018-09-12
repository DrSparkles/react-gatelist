const path = require("path");
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV = 'development' } = process.env;

const mode = (NODE_ENV === 'production') ? 'production' : 'development';

module.exports = {
  mode: mode,
  entry: "./server.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "server.js"
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
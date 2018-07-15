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
        use: ['babel-loader'],
        exclude: /node_modules/,
      }
    ]
  }
};
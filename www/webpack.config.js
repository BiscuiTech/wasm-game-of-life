const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",
  experiments: {
    asyncWebAssembly: true
  },
  optimization: {
    // runtimeChunk: 'single'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin({patterns: ['index.html']})
  ],
};

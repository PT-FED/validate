/**
 * Created by ligang on 16/9/2.
 */
var webpack = require("webpack");
var path = require("path");

var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
    entry: "./src/validate.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "validate.min.js"
    },
    // 压缩JS
    plugins: [
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
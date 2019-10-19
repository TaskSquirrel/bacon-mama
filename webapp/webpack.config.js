const webpack = require("webpack");
const path = require("path");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "../src/main/resources/static"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.js/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
    ]
};
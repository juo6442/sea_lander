const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: [
        './src/main.ts',
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "web" },
                { from: "res", to: "res" },
            ],
        }),
    ],
};

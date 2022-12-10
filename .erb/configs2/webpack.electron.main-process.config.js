const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'source-map',
    entry: './desktop/main.dev.ts',
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            // TTF Font
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream'
                    }
                }
            },
            // SVG
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        mimetype: 'image/svg+xml'
                    }
                }
            },
            // Common Image Formats
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader'
            },
            {
                test: /\.wasm$/,
                type: "javascript/auto"
            }
        ],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'main.js',
    },
};
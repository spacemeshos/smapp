const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
import { spawn, execSync } from 'child_process';

module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        mainFields: ['main', 'module', 'browser'],
    },
    entry: './app/index.tsx',
    target: 'electron-renderer',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
           /* {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: [
                                require.resolve('react-refresh/babel')
                            ].filter(Boolean)
                        }
                    }
                ]
            },*/
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
                type: 'javascript/auto'
            }
        ],
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    devServer: {
        headers: { 'Access-Control-Allow-Origin': '*' },
        static: {
            directory: path.join(__dirname, '../desktop'),
            publicPath: '/'
        },
        historyApiFallback: {
            verbose: true,
        },
        compress: true,
        hot: true,
        port: 4000,
        setupMiddlewares(middlewares) {
            console.log('Starting preload.js builder...');
            const preloadProcess = spawn('npm', ['run', 'start:preload'], {
                shell: true,
                stdio: 'inherit',
            })
                .on('close', (code: number) => process.exit(code!))
        .on('error', (spawnError) => console.error(spawnError));

            console.log('Starting Main Process...');
            let args = ['run', 'start:main'];
            if (process.env.MAIN_ARGS) {
                args = args.concat(
                    ['--', ...process.env.MAIN_ARGS.matchAll(/"[^"]+"|[^\s"]+/g)].flat()
                );
            }
            spawn('npm', args, {
                shell: true,
                stdio: 'inherit',
            })
                .on('close', (code: number) => {
                    preloadProcess.kill();
                    process.exit(code!);
                })
                .on('error', (spawnError) => console.error(spawnError));
            return middlewares;
        }
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'renderer.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './external/index.html'
        }),
    ],
};
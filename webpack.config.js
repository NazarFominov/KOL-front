const path = require('path');
const webpack = require('webpack');

const dotenv = require('dotenv').config({path: __dirname + '/.env'});

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = (env) => {
    return {
        devServer: {
            inline: true,
            contentBase: './dist',
            port: 3001,
            historyApiFallback: true,
        },
        devtool: env && env.hasOwnProperty('RELEASE') && env.RELEASE === 'production' ?
            false :
            'cheap-module-eval-source-map',
        entry: './src/js/index.js',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        'babel-loader',
                        {
                            loader: 'webpack-preprocessor-loader',
                            options: {
                                params: {
                                    RELEASE: env && env.RELEASE ? env.RELEASE : 'development',
                                },
                            },
                        },
                    ],
                    exclude: /node_modules\\(?!ff)/,
                },
                {
                    test: /\.(css|scss)$/,
                    use: ['style-loader', 'css-loader', 'sass-loader',],
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: 'file-loader',
                },
            ],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: 'js/bundle.min.js',
            chunkFilename: 'js/[name].[chunkhash].[hash].bundle.js',
            publicPath: '/',
        },
        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    // styles: {
                    //     name: 'styles',
                    //     test: /\.css$/,
                    //     chunks: 'all',
                    //     enforce: true,
                    // },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
            // minimizer: [new OptimizeCSSAssetsPlugin({})],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.IgnorePlugin({
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    RELEASE: env && env.hasOwnProperty('RELEASE') ?
                        JSON.stringify(env.RELEASE) :
                        JSON.stringify('development'),
                    NODE_IP: JSON.stringify(process.env.NODE_IP) || JSON.stringify('localhost')
                },
            }),
            new webpack.ContextReplacementPlugin(
                /_locale$/,
                /ru/,
            ),
            new CopyPlugin({
                patterns: [
                    // {
                    //     from: 'src/data',
                    //     to: './data',
                    // },
                    {
                        from: 'src/images',
                        to: './images',
                    },
                    // {
                    //     from: 'src/fonts',
                    //     to: './fonts',
                    // },
                ]
            }),
            new HtmlWebpackPlugin({
                date: new Date().toDateString() + ' ' + new Date().toLocaleTimeString(),
                template: './src/html/index.html',
                filename: './index.html',
                inject: false,
                chunksSortMode: 'none',
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: env && env.hasOwnProperty('ANALYZER') ? 'server' : 'disabled',
                analyzerHost: 'localhost',
                analyzerPort: 8888,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info',
            }),
        ],
    };
};

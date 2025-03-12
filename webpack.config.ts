import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpack from 'webpack';
import 'webpack-dev-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const config: webpack.Configuration = {
    entry: "./src/index.js",
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "./main.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        compress: true,
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            },
        ],
    }
}

export default config;
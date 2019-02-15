const HtmlWebpackPlugin = require('html-webpack-plugin');

const source = './app-src';
const destination = './app-build';
const path = require('path');
const appConfig = require(`${source}/constants/config.json`);

const config = {
	mode: 'development',
	entry: `${source}/app.js`,
	output: {
		path: path.resolve(__dirname, destination),
		filename: `${appConfig.appName}-${appConfig.version}.js`,
		libraryTarget: 'umd',
		libraryExport: 'default',
		library: 'LoomSE'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ttf$/,
				exclude: /node_modules/,
				use: {
					loader: 'file-loader'
				}
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: {
					loader: 'sass-loader'
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Loom Story Engine',
			template: 'template.html',
			filename: '../index.html'
		})
	]
};

module.exports = config;

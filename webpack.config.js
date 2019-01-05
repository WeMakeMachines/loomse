const source = './app-src';
const destination = './app-build';

const webpack = require('webpack');
const path = require('path');
const appConfig = require(`${source}/configs/config.json`);

const config = {
	mode: 'development',
	entry: `${source}/app.js`,
	output: {
		path: path.resolve(__dirname, destination),
		filename: `${appConfig.appName}-${appConfig.version}.js`
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	}
};

module.exports = config;

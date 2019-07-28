const source = './source';
const destination = './dist';
const path = require('path');
const packageJson = require('./package.json');

const config = {
	entry: `${source}/app.js`,
	output: {
		path: path.resolve(__dirname, destination),
		filename: `${packageJson.name}-${packageJson.version}.js`,
		libraryTarget: 'umd',
		libraryExport: 'default',
		library: 'LoomSE'
	},
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

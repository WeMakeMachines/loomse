// Rollup plugins
import babel from 'rollup-plugin-babel';
import config from './app-src/configs/config';
import eslint from 'rollup-plugin-eslint';
import html from 'rollup-plugin-html';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

// eslint-disable-next-line
let environment = process.env.NODE_ENV || 'development',
	buildArguments = {
	input : 'app-src/app.js',
	output: {
		file  : `app-build/${config.appName}-${config.version}.js`,
		format: 'iife'
	},
	exports: 'default',
	name   : config.appName,
	plugins: [
		html({
			include: 'app-src/templates/*.html'
		}),
		babel({
			exclude: 'node_modules/**'
		}),
		replace({
			exclude: 'node_modules/**',
			ENV    : JSON.stringify(environment)
		})
	],
	watch: {
		include: 'app-src/**'
	}
};

if (environment === 'development') {
	buildArguments.sourcemap = 'inline';
}

if (environment === 'production') {
	buildArguments.plugins.unshift(
		eslint({
			exclude: []
		})
	);

	buildArguments.plugins.push(uglify());
}

export { buildArguments as default };
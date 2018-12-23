import config from './app-src/configs/config.json';

// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import html from 'rollup-plugin-html';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

// eslint-disable-next-line
let environment = process.env.NODE_ENV || 'development',
	buildArguments = {
	input : 'app-src/app.js',
	output: {
		name   : config.appName,
		file  : `app-build/${config.appName}-${config.version}.js`,
		format: 'iife',
		exports: 'default'
	},
	plugins: [
		babel({
			include: 'app-src/**/*.js'
		}),
		html({
			include: 'app-src/**/*.html'
		}),
		json({
			include: 'app-src/**/*.json'
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
	buildArguments.output.sourcemap = 'inline';
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

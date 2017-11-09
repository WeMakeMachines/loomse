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
	entry     : 'app-src/base.js',
	dest      : `app-build/${config.appName}-${config.version}.js`,
	format    : 'iife',
	exports   : 'default',
	moduleName: config.appName,
	plugins   : [
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
	]
};

if (environment === 'development') {
	buildArguments.sourceMap = 'inline';
}

if (environment === 'production') {
	buildArguments.plugins.push(
		eslint({
			exclude: []
		}),
		uglify()
	);
}

export { buildArguments as default };
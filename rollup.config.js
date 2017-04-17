// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

// eslint-disable-next-line
let environment = process.env.NODE_ENV || 'development',
	buildArguments = {
	entry    : 'app-src/core.js',
	dest     : 'app-build/loomSE-0.4.0.js',
	format   : 'iife',
	sourceMap: 'inline',
	plugins  : [
		babel({
			exclude: 'node_modules/**'
		}),
		replace({
			exclude: 'node_modules/**',
			ENV    : JSON.stringify(environment)
		})
	]
};

if (environment === 'production') {
	buildArguments.plugins.push(
		eslint({
			exclude: []
		}),
		uglify()
	);
}

export { buildArguments as default };

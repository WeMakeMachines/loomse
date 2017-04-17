// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

export default {
	entry: 'app-src/core.js',
	dest: 'app-build/loomSE-0.4.0.min.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		// eslint({
		// 	exclude: []
		// }),
		babel({
			exclude: 'node_modules/**',
		})
	]
};
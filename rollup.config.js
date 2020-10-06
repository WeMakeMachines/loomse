import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'source/App.js',
	output: {
		file: 'dist/loomse.min.js',
		format: 'cjs',
		exports: 'default'
	},
	external: ['redom'],
	plugins: [json(), commonjs(), babel({ babelHelpers: 'bundled' }), terser()]
};

import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
	input: 'source/App.ts',
	output: {
		file: 'dist/loomse.min.js',
		format: 'cjs',
		exports: 'default'
	},
	external: ['redom'],
	plugins: [typescript(), terser()]
};

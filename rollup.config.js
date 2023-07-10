import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default [
	// es module output
	{
		input: 'source/index.ts',
		output: {
			file: 'dist/loomse.es.min.js',
			format: 'es',
			exports: 'default'
		},
		external: ['redom'],
		plugins: [typescript(), terser()]
	},
	// umd output
	{
		input: 'source/index.ts',
		output: {
			file: 'dist/loomse.min.js',
			format: 'umd',
			name: 'LoomSE'
		},
		plugins: [typescript(), nodeResolve(), terser()]
	}
];

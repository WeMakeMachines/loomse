import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const devMode = process.env.mode === 'dev';
const minify = devMode ? undefined : terser();

export default [
	// es module output
	{
		input: 'source/index.ts',
		output: {
			file: 'dist/loomse.es.min.js',
			format: 'es',
			exports: 'default',
			sourcemap: devMode
		},
		external: ['redom', 'simple-subtitle-parser'],
		plugins: [typescript(), minify]
	},
	// umd output
	{
		input: 'source/index.ts',
		output: {
			file: 'dist/loomse.min.js',
			format: 'umd',
			name: 'LoomSE',
			sourcemap: devMode
		},
		plugins: [typescript(), nodeResolve(), minify]
	}
];

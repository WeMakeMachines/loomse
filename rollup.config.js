import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));
const devMode = process.env.mode === 'dev';
const minify = devMode ? undefined : terser();

export default [
	// umd output
	{
		input: 'source/index.ts',
		output: {
			file: pkg.main,
			format: 'umd',
			exports: 'named',
			name: 'loomse',
			sourcemap: devMode
		},
		plugins: [typescript(), nodeResolve(), minify]
	},
	// es module output
	{
		input: 'source/index.ts',
		output: {
			file: pkg.module,
			format: 'es',
			exports: 'named',
			sourcemap: devMode
		},
		external: ['redom', 'simple-subtitle-parser'],
		plugins: [typescript(), minify]
	}
];

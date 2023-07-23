import { defineConfig } from 'tsup';

export default defineConfig([
	{
		format: 'esm',
		entry: { 'loomse.esm': 'source/index.ts' },
		outDir: './dist',
		dts: 'source/index.ts',
		splitting: false,
		sourcemap: true,
		clean: true,
		publicDir: true
	},
	{
		format: 'esm',
		entry: { 'loomse.cjs': 'source/index.ts' },
		outDir: './dist',
		dts: 'source/index.ts',
		splitting: false,
		sourcemap: true,
		clean: true
	}
]);

import { defineConfig } from 'tsup';

export default () => {
	return defineConfig([
		{
			format: 'esm',
			entry: { 'loomse.esm': 'source/index.ts' },
			outDir: './dist',
			dts: 'source/index.ts',
			splitting: false,
			clean: true,
			publicDir: true,
			sourcemap: !!process.env.NODE_ENV
		},
		{
			format: 'esm',
			entry: { 'loomse.cjs': 'source/index.ts' },
			outDir: './dist',
			dts: 'source/index.ts',
			splitting: false,
			clean: true,
			sourcemap: !!process.env.NODE_ENV
		}
	]);
};

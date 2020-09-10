import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';
import del from 'del';

const banner = [
	'/*!',
	` * @tawaship/task - v${require('./package.json').version}`,
	' * ',
	' * @author tawaship (makazu.mori@gmail.com)',
	' * @license MIT',
	' */',
	''
].join('\n');

export default (async () => {
	if (process.env.PROD) {
		await del(['./docs', './types', './dist']);
	}
	
	return [
		{
			input: 'src/module.ts',
			output: [
				{
					banner,
					file: 'dist/Task.cjs.js',
					format: 'cjs',
					sourcemap: true
				},
				{
					banner,
					file: 'dist/Task.esm.js',
					format: 'esm',
					sourcemap: true
				}
			],
			watch: {
				clearScreen: false
			},
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript()
			]
		},
		{
			input: 'src/browser.ts',
			output: [
				{
					banner,
					file: 'dist/Task.js',
					format: 'iife',
					name: 'Task',
					sourcemap: true
				}
			],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript(),
				buble(),
				terser({
					compress: {
						defaults: false,
						drop_console: true
					},
					mangle: false,
					output: {
						beautify: true,
						braces: true
					}
				})
			]
		},
		{
			input: 'src/browser.ts',
			output: [
				{
					banner,
					file: 'dist/Task.min.js',
					format: 'iife',
					name: 'Task'
				}
			],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript(),
				buble(),
				terser({
					compress: {
						drop_console: true
					}
				})
			]
		}
	]
})();
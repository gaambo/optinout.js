import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.js', 
        output: [
            { file: pkg.main, format: 'iife', name: 'optinout' }, 
            { file: pkg.browser, format: 'umd', name: 'optinout' }
        ],
        plugins: [
            resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			babel({
				exclude: ['node_modules/**']
			})
        ]
    }, 

    // CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// the `targets` option which can specify `dest` and `format`)
	{
		input: 'src/main.js',
		external: [],
		output: [
			{ file: pkg.commonModule, format: 'cjs', name: 'optinout' },
			{ file: pkg.module, format: 'es', name: 'optinout' }
		],
		plugins: [
			babel({
				exclude: ['node_modules/**']
			})
		]
	}
]
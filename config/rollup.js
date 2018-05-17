const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const pkg = require('../package.json');

const name = 'OptInOut';

const banner = `/* ${pkg.name} - v${pkg.version} | Copyright: ${pkg.author} and other contributors | License: https://gitlab.com/optinout/optinout.js */`;

const browserConfig = {
  input: 'src/browser.js',
  banner: banner,
  plugins: [
    resolve(), // so Rollup can find `ms`
    commonjs(), // so Rollup can convert `ms` to an ES module
    babel({
      exclude: ['node_modules/**'],
      plugins: ["external-helpers", "transform-object-assign"]
    })
  ]
};

const moduleConfig = {
  input: 'src/main.js',
  banner: banner,
  external: [],
  plugins: [
    babel({
      exclude: ['node_modules/**'],
      plugins: ["external-helpers"]
    })
  ]
}

const config = [];
//IIFE
config[0] = Object.assign({
  file: pkg.main,
  format: 'iife',
  name: name
}, browserConfig);

//UMD
config[1] = Object.assign({
  file: pkg.browser,
  format: 'umd',
  name: name
}, browserConfig);

// CommonJS (for Node) and ES module (for bundlers) build.
// (We could have three entries in the configuration array
// instead of two, but it's quicker to generate multiple
// builds from a single configuration where possible, using
// the `targets` option which can specify `dest` and `format`)
config[2] = Object.assign({
  file: pkg.commonModule,
  format: 'cjs',
  name: name
}, moduleConfig);

config[3] = Object.assign({
  file: pkg.module,
  format: 'es',
  name: name
}, moduleConfig);

module.exports = config; 
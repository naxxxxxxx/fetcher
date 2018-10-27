import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import browserConfig from './babel.browser.config.js'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [babel(browserConfig), commonjs(), json()]
}

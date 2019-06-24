import { uglify } from 'rollup-plugin-uglify'
import baseConfig from './rollup.config.base'

baseConfig.output = {
  file: 'dist/cdom.min.js',
  format: 'umd',
  name: 'CDOM'
}

baseConfig.plugins.push(uglify())

export default baseConfig

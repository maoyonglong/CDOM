import baseConfig from './rollup.config.base'

baseConfig.output = {
  file: 'dist/cdom.js',
  format: 'umd',
  name: 'CDOM'
}

export default baseConfig

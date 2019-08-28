const path = require('path')

module.exports = {
  entry: {
    layout: './src/public/js/layout.js'
  },
  output: {
    path: path.resolve(__dirname, 'build/public/js'),
    filename: '[name].js'
  },
  mode: 'development'
}

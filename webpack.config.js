const path = require('path')

module.exports = {
  entry: {
    all: './src/public/js/all.js'
  },
  output: {
    path: path.resolve(__dirname, 'build/public/js'),
    filename: '[name].js'
  },
  mode: 'development'
}

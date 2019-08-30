const path = require('path')

module.exports = {
  entry: {
    layout: './src/public/js/layout.js',
    eventCard: './src/public/js/eventCard.js',
    map: './src/public/js/map.js',
    settings: './src/public/js/settings.js'
  },
  output: {
    path: path.resolve(__dirname, 'build/public/js'),
    filename: '[name].js'
  },
  mode: 'development'
}

const sqlite = require('sqlite')
const path = require('path')
const dbpath = path.resolve(__dirname, '../../build/eventz.db')

module.exports = () => sqlite.open(dbpath, { promise: Promise, verbose: true })

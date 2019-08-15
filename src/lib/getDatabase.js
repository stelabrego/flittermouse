const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const getDatabase = (callback) => {
  const dbpath = path.resolve(__dirname, '../eventz.db')
  return new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      callback(err)
    }
  })
}

module.exports = getDatabase

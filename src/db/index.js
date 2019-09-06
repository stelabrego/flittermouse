const { Pool } = require('pg')
const connectionString = `postgresql://postgres:example@db/eventz`
const pool = new Pool({
  connectionString
})
module.exports = {
  query: (text, params) => {
    const start = Date.now()
    return pool.query(text, params)
      .then(res => {
        const duration = Date.now() - start
        console.log('executed query', { text, duration, rows: res.rowCount })
        return res
      })
  },
  getClient: () => pool.connect()
}

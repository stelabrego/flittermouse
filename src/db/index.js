const { Pool } = require('pg')

const {
  NODE_ENV = 'development',
  PGHOST = 'localhost',
  PGUSER = 'postgres',
  PGDATABASE = 'eventz',
  PGPASSWORD = 'example',
  PGPORT = 5432
} = process.env

let pool
if (NODE_ENV === 'production') {
  const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@db/${PGDATABASE}`
  pool = new Pool({
    connectionString
  })
} else {
  pool = new Pool({
    host: PGHOST,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT
  })
}
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

const { Pool } = require('pg')

const {
  NODE_ENV = 'development',
  POSTGRES_HOST = 'localhost',
  POSTGRES_USER = 'postgres',
  POSTGRES_DB = 'flittermouse',
  POSTGRES_PASSWORD = 'thecatsatonthestoolandplayedthepiano',
  POSTGRES_PORT = 5432
} = process.env

let pool
if (NODE_ENV === 'production') {
  const connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}`
  pool = new Pool({
    connectionString
  })
} else {
  pool = new Pool({
    host: POSTGRES_HOST,
    user: POSTGRES_USER,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: POSTGRES_PORT
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

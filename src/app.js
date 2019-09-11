const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const redis = require('redis')
const moment = require('moment')
const db = require('./db')
const mountRoutes = require('./routes')

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
const {
  SESSION_LIFETIME = TWO_WEEKS,
  SESSION_NAME = 'eventz_sid',
  SESSION_SECRET = 'devTestSecret',
  NODE_ENV = 'development',
  REDIS_URL
} = process.env

const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', true)

app.use(logger(':date :method :url'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../dist')))

const RedisStore = require('connect-redis')(session)
let client
if (REDIS_URL) client = redis.createClient(REDIS_URL)
else client = redis.createClient()
client.on('error', console.error)
app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client }),
  secret: SESSION_SECRET,
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: false // TODO: NODE_ENV === 'production'
  }
}))

app.locals.moment = moment

const createMockData = require('./db/createMockData')
const retry = (fn, retries = 3) => fn().catch(e => retries <= 0 ? Promise.reject(e) : retry(fn, retries - 1))
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const delayError = (fn, ms) => () => fn().catch(e => delay(ms).then(y => Promise.reject(e)))
retry(delayError(createMockData, 3000)).catch(err => { console.log('Could not create test data', err.message) })

// extract user_id from session
app.use(async (req, res, next) => {
  try {
    console.log(req.session.userId)
    const userId = req.session.userId
    if (userId) {
      const result = await db.query('SELECT * FROM users WHERE user_id = $1', [userId])
      res.locals.sessionUser = result.rows[0]
    }
  } catch (err) {
    console.error(err.message, err.stack)
  }
  next()
})

mountRoutes(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('NODE_ENV') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) res.json({ success: false, message: '404 bad URL' })
  else res.render('error', { user: res.locals.sessionUser })
})

module.exports = app

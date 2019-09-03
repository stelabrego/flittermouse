const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const fs = require('fs')
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
  NODE_ENV = 'development'
} = process.env

if (NODE_ENV === 'development') {
  const createMockData = require('./db/createMockData')
  createMockData().then(created => { if (created) console.log('Test Data Created') })
}

const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const accessLogStream = fs.createWriteStream(path.join(__dirname, '../build/access.log'), { flags: 'a' })
app.use(logger(':date :method :url', { stream: accessLogStream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../build/public')))

const RedisStore = require('connect-redis')(session)
const client = redis.createClient()
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
    secure: NODE_ENV === 'production'
  }
}))

app.locals.moment = moment

// extract user_id from session
app.use(async (req, res, next) => {
  try {
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

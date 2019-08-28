const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const fs = require('fs')
const session = require('express-session')
const dbPromise = require('./lib/dbPromise')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const eventsRouter = require('./routes/events')
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')
const homeRouter = require('./routes/home')
const logoutRouter = require('./routes/logout')

const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14
const {
  SESSION_LIFETIME = TWO_WEEKS,
  SESSION_NAME = 'sid',
  SESSION_SECRET = 'devTestSecret',
  NODE_ENV = 'development'
} = process.env

if (NODE_ENV === 'development') {
  dbPromise(console.log)
    .then(db => db.populate())
    .catch(console.log)
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
app.use(session({
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: {
    maxAge: SESSION_LIFETIME,
    sameSite: true,
    secure: NODE_ENV === 'production'
  }
}))

// extract userId from session
app.use(async (req, res, next) => {
  const { userId } = req.session
  if (userId) {
    const db = await dbPromise(console.log)
    const user = await db.selectUserById(userId)
    res.locals.user = user
  }
  next()
})

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/users', usersRouter)
app.use('/events', eventsRouter)
app.use('/home', homeRouter)
app.use('/logout', logoutRouter)

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
  else res.render('error', { user: res.locals.user })
})

module.exports = app

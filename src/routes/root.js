const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

const redirectHome = (req, res, next) => {
  if (res.locals.sessionUser) res.redirect('/home')
  else next()
}

router.get('/', redirectHome, function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    res.render('index', sessionUser)
  } catch (err) {
    console.log(err.stack)
    next(err)
  }
})

module.exports = router

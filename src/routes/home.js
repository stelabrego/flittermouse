var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

const redirectIndex = (req, res, next) => {
  if (!res.locals.sessionUser) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, function (req, res, next) {
  const { sessionUser } = res.locals
  res.render('home', { sessionUser })
})

module.exports = router

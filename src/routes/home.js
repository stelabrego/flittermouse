var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

const redirectIndex = (req, res, next) => {
  if (!res.locals.user) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, function (req, res, next) {
  const { user } = res.locals
  res.render('home', { user })
})

module.exports = router

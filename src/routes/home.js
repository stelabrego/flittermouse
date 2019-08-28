var express = require('express')
var router = express.Router()

const redirectIndex = (req, res, next) => {
  if (!req.session.userId) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, function (req, res, next) {
  res.render('home')
})

module.exports = router

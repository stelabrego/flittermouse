var express = require('express')
var router = express.Router()

const redirectHome = (req, res, next) => {
  if (req.session.userId) res.redirect('/home')
  else next()
}

router.get('/', redirectHome, function (req, res, next) {
  const { userId } = req.session
  res.render('index', { title: 'Eventz', message: userId ? `your userId is ${userId}` : 'not logged in' })
})

module.exports = router

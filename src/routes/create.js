const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.get('/', (req, res, next) => {
  const { sessionUser } = res.locals
  res.render('create-event', sessionUser)
})

module.exports = router

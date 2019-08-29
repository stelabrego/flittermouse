var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

const redirectHome = (req, res, next) => {
  if (req.session.userId) res.redirect('/home')
  else next()
}

router.get('/', redirectHome, function (req, res, next) {
  res.render('index')
})

router.get('/:username', async function (req, res, next) {
  const { sessionUser } = res.locals
  const targetUsername = req.params.username
  if (sessionUser && sessionUser.username === targetUsername) {
    res.redirect('/home')
    next()
  }
  const db = await dbPromise(console.log)
  const targetUser = await db.selectUserByUsername(targetUsername)
  const events = await db.selectEventsByUserId(targetUser.id)
  console.log(events)
  res.render('user', { sessionUser, targetUser, events })
})

module.exports = router

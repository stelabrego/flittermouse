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
  if (['home', 'events', 'settings', 'blog', 'about'].includes(targetUsername)) {
    next()
  }
  if (sessionUser && sessionUser.username === targetUsername) {
    res.redirect('/home')
    next()
  }
  const db = await dbPromise(console.log)
  const targetUser = await db.selectUserByUsername(targetUsername)
  const hostingEvents = await db.selectEventsByUserId(targetUser.id)
  const attendance = await db.selectAttendanceByUserId(targetUser.id)
  const attendingEvents = await Promise.all(attendance.map(attendance => db.selectEventById(attendance.eventId)))
  console.log(hostingEvents)
  console.log(attendingEvents)
  res.render('user', { sessionUser, targetUser, hostingEvents, attendingEvents })
})

module.exports = router

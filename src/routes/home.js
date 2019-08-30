var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

const redirectIndex = (req, res, next) => {
  if (!res.locals.sessionUser) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, async function (req, res, next) {
  const { sessionUser } = res.locals
  const db = await dbPromise()
  const hostingEvents = await db.selectEventsByUserId(sessionUser.id)
  const attendance = await db.selectAttendanceByUserId(sessionUser.id)
  const attendingEvents = await Promise.all(attendance.map(attendance => db.selectEventById(attendance.eventId)))
  res.render('home', { sessionUser, hostingEvents, attendingEvents })
})

module.exports = router

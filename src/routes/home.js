const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

const redirectIndex = async (req, res, next) => {
  if (!res.locals.sessionUser) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, async function (req, res, next) {
  const { sessionUser } = res.locals
  // const hostingEvents = await db.selectEventsByUserId(sessionUser.id)
  // const attendance = await db.selectAttendanceByUserId(sessionUser.id)
  // const attendingEvents = await Promise.all(attendance.map(attendance => db.selectEventById(attendance.eventId)))
  let result = await db.query('SELECT * FROM event WHERE userId = $1', [sessionUser.id])
  const hostingEvents = result.rows
  result = await db.query('SELECT * FROM event WHERE id IN (SELECT eventId FROM attendance WHERE userId = $1)', [sessionUser.id])
  const attendingEvents = result.rows
  res.render('home', { sessionUser, hostingEvents, attendingEvents })
})

module.exports = router

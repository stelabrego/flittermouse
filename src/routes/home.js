const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

const redirectIndex = async (req, res, next) => {
  if (!res.locals.sessionUser) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    let result = await db.query('SELECT * FROM events WHERE user_id = $1', [sessionUser.user_id])
    const hostingEvents = result.rows
    result = await db.query('SELECT * FROM events WHERE event_id IN (SELECT event_id FROM attendance WHERE user_id = $1)', [sessionUser.user_id])
    const attendingEvents = result.rows
    res.render('home', { sessionUser, hostingEvents, attendingEvents })
  } catch (err) {
    console.error(err.stack)
    next(err)
  }
})
module.exports = router

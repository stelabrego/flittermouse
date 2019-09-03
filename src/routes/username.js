const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.get('/:username', async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    const targetUsername = req.params.username
    if (sessionUser && sessionUser.username === targetUsername) {
      res.redirect('/home')
    } else {
      let result = await db.query('SELECT * FROM users WHERE username = $1', [targetUsername])
      if (result.rows.length === 0) next()
      else {
        const targetUser = result.rows[0]
        result = await db.query('SELECT * FROM events WHERE user_id = $1', [targetUser.user_id])
        const hostingEvents = result.rows
        result = await db.query('SELECT * FROM events WHERE event_id IN (SELECT event_id FROM attendance WHERE user_id = $1)', [targetUser.user_id])
        const attendingEvents = result.rows
        res.render('user', { sessionUser, targetUser, hostingEvents, attendingEvents })
      }
    }
  } catch (err) {
    console.error(err.stack)
    next(err)
  }
})

module.exports = router

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
        let isFollowing = false
        if (sessionUser) {
          result = await db.query('SELECT * FROM user_relationships WHERE initial_user_id = $1 AND target_user_id = $2', [sessionUser.user_id, targetUser.user_id])
          isFollowing = (result.rows.length > 0 && result.rows[0].relationship === 'follow')
        }
        res.render('user', { sessionUser, targetUser, hostingEvents, attendingEvents, isFollowing })
      }
    }
  } catch (err) {
    console.error(err.stack)
    next(err)
  }
})

module.exports = router

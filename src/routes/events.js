const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
// Add event
router.get('/:urlKey', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    const { urlKey } = req.params
    let result = await db.query('SELECT * FROM events WHERE url_key = $1', [urlKey])
    const event = result.rows[0]
    result = await db.query('SELECT * FROM users WHERE user_id = $1', [event.user_id])
    const eventUser = result.rows[0]
    result = await db.query('SELECT * FROM event_tags WHERE event_id = $1', [event.event_id])
    const eventTags = result.rows
    result = await db.query('SELECT * FROM event_questions WHERE event_id = $1', [event.event_id])
    const eventQuestions = result.rows
    let userIsAttending = false
    let userOwnsEvent = false
    if (sessionUser) {
      result = await db.query('SELECT * FROM attendance WHERE user_id = $1 AND event_id = $2', [sessionUser.user_id, event.event_id])
      userIsAttending = result.rows.length > 0
      userOwnsEvent = event.user_id === sessionUser.user_id
    }
    res.render('event', { sessionUser, event, eventTags, eventQuestions, eventUser, userIsAttending, userOwnsEvent })
  } catch (err) {
    console.error(err.stack)
    next(err)
  }
})

module.exports = router

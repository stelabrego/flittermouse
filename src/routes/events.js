const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
// Add event
router.get('/:urlKey', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    const { urlKey } = req.params
    let result = await db.query('SELECT * FROM events WHERE eventId = $1', [urlKey])
    const event = result.rows[0]
    result = await db.query('SELECT * FROM users WHERE userId = $1', [event.userId])
    const eventUser = result.rows[0]
    result = await db.query('SELECT * FROM eventTags WHERE eventId = $1', [event.eventId])
    const eventTags = result.rows
    result = await db.query('SELECT * FROM eventQuestions WHERE eventId = $1', [event.eventId])
    const eventQuestions = result.rows
    let userIsAttending = false
    let userOwnsEvent = false
    if (sessionUser) {
      result = await db.query('SELECT * FROM attendance WHERE userId = $1 AND eventId = $2', [sessionUser.userId, event.eventId])
      userIsAttending = result.rows.length > 0
      userOwnsEvent = event.userId === sessionUser.userId
    }
    res.render('event', { sessionUser, event, eventTags, eventQuestions, eventUser, userIsAttending, userOwnsEvent })
  } catch (err) {
    console.error(err.stack)
    next(err)
  }
})

module.exports = router

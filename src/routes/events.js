const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
// Add event
router.get('/:urlKey', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    const { urlKey } = req.params
    let result = await db.query('SELECT * FROM event WHERE id = $1', [urlKey])
    const event = result.rows[0]
    result = await db.query('SELECT * FROM user WHERE id = $1', [event.userId])
    const eventUser = result.rows[0]
    result = await db.query('SELECT * FROM eventTag WHERE eventId = $1', [event.id])
    const eventTags = result.rows
    result = await db.query('SELECT * FROM eventQuestion WHERE eventId = $1', [event.id])
    const eventQuestions = result.rows
    let userIsAttending = false
    let userOwnsEvent = false
    if (sessionUser) {
      result = await db.query('SELECT * FROM attendance WHERE userId = $1 AND eventId = $2', [sessionUser.id, event.id])
      userIsAttending = result.rows.length > 0
      userOwnsEvent = event.userId === sessionUser.id
    }
    res.render('event', { sessionUser, event, eventTags, eventQuestions, eventUser, userIsAttending, userOwnsEvent })
  } catch (err) {
    console.error(err.stack)
    next(err)
  }
})

module.exports = router

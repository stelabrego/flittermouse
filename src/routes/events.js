const Router = require('express-promise-router')
const generate = require('nanoid/generate')
const nolookalikes = require('nanoid-dictionary/nolookalikes')
const moment = require('moment')
const db = require('../db')
const router = new Router()
// Add event
router.post('/create', async (req, res, next) => {
  let invalidFields = []
  try {
    const { sessionUser } = res.locals
    if (!sessionUser) throw Error('Not logged in')
    const urlKey = generate(nolookalikes, 6)
    let {
      name,
      description,
      dateStart,
      dateEnd,
      timezone,
      location
    } = req.body
    console.log(req.body)
    if (!dateStart) {
      dateStart = null
      timezone = null
    }
    if (!dateEnd) dateEnd = null

    if (!name || name.length > 40) invalidFields.push('name')
    if (description && description.length > 160) invalidFields.push('description')
    if (dateStart && !moment(dateStart).isValid()) invalidFields.push('dateStart')
    if (dateEnd && !moment(dateEnd).isValid()) invalidFields.push('dateEnd')
    if (dateEnd && !dateStart) invalidFields.push('dateStart')
    if (timezone && !['Atlantic', 'Eastern', 'Central', 'Mountain', 'Pacific', 'Alaska', 'Hawaii'].includes(timezone)) invalidFields.push('timezone')
    if (moment(dateEnd).isBefore(dateStart)) invalidFields.push('dateEnd')
    invalidFields = [...new Set(invalidFields)]
    if (invalidFields.length > 0) throw Error('Invalid Fields')

    await db.query('INSERT INTO events (user_id, url_key, name, description, date_start, date_end, timezone, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [sessionUser.user_id, urlKey, name, description, dateStart, dateEnd, timezone, location])
    res.json({ success: true })
  } catch (err) {
    console.error(err.stack)
    res.json({ success: false, message: err.message, invalidFields })
  }
})

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

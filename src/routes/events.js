const express = require('express')
const router = express.Router()
const dbPromise = require('../lib/dbPromise')
// Add event

router.get('/:urlKey', async (req, res, next) => {
  const { sessionUser } = res.locals
  const { urlKey } = req.params
  const db = await dbPromise()
  const event = await db.selectEventByUrlKey(urlKey)
  if (event) {
    console.log(event)
    const eventUser = await db.selectUserById(event.userId)
    const eventTags = await db.selectEventTagsByEventId(event.id)
    const eventQuestions = await db.selectEventQuestionsByEventId(event.id)
    console.log(eventQuestions)
    res.render('event', { sessionUser, event, eventTags, eventQuestions, eventUser })
  } else next()
})

router.post('/add', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.insertEvent(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

router.delete('/delete', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.deleteEvent(req.body.id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.updateEvent(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

// can only change one thing at a time
router.put('/privacy/update', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.updateEventPrivacy(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

module.exports = router

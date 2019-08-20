const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const dbPromise = require('../lib/dbPromise')
const SQL = require('sql-template-strings')

// Add event
router.post('/add', async (req, res, next) => {
  try {
    const eventKey = crypto.randomBytes(6).toString('hex')
    const columns = ['userKey', 'name', 'dateOf', 'address']
    const values = columns.reduce((prev, curr) => {
      prev[curr] = req.body[curr] || null
      return prev
    }, { eventKey })
    const statement = SQL`
    INSERT
    INTO event
    (userID, name, key, dateOf, address)
    SELECT user.ROWID, ${values.name}, ${values.eventKey}, ${values.dateOf}, ${values.address}
    FROM user WHERE user.key = ${values.userKey}`
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error('Invalid userKey')
    res.json({ success: true, eventKey, message: 'Created event successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.delete('/delete', async (req, res, next) => {
  try {
    if (!req.body.eventKey || Object.keys(req.body).length !== 1) throw Error('request fields are incorrect')
    const statement = SQL`
      DELETE
      FROM event
      WHERE event.key = ${req.body.eventKey}
    `
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error('Invalid eventKey')
    res.json({ success: true, message: 'Deleted event successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  try {
    const columns = ['name', 'location', 'dateOf']
    const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
      if (columns.includes(curr)) return curr
    }, null)
    if (!targetColumn || !req.body.eventKey || Object.keys(req.body).length !== 2) {
      throw Error('request keys are not correct')
    }
    const statement = SQL`
      UPDATE event
      SET `.append(targetColumn).append(SQL` = ${req.body[targetColumn]}
      WHERE event.key = ${req.body.eventKey}
    `)
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error('Invalid eventKey')
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/privacy/update', async (req, res, next) => {
  try {
    const columns = ['displayAddress', 'displayDate', 'visibility']
    const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
      if (columns.includes(curr)) return curr
    }, null)
    if (!targetColumn || !req.body.eventKey || Object.keys(req.body).length !== 2) {
      throw Error('request keys are not correct')
    }
    const statement = SQL`
      UPDATE eventPrivacy
      SET `.append(targetColumn).append(SQL` = ${req.body[targetColumn]}
      WHERE eventPrivacy.eventID = (
        SELECT (rowid) 
        FROM event 
        WHERE event.key = ${req.body.eventKey}
      )
    `)
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error('Event key doesn\'t exist')
    res.json({ success: true, message: 'Updated event privacy successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const dbPromise = require('../lib/dbPromise')
const SQL = require('sql-template-strings')

// Add event
router.post('/add', async (req, res, next) => {
  let db
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['userKey', 'name', 'dateOf', 'address']
    if (reqFieldNames.length < 1 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    const eventKey = crypto.randomBytes(6).toString('hex')
    const reqValues = validFieldNames.reduce((result, fieldName) => {
      result[fieldName] = req.body[fieldName] || null
      return result
    }, { eventKey })
    const statement = SQL`
    INSERT
    INTO event
    (userID, name, key, dateOf, address)
    SELECT user.ROWID, ${reqValues.name}, ${reqValues.eventKey}, ${reqValues.dateOf}, ${reqValues.address}
    FROM user WHERE user.key = ${reqValues.userKey}`
    db = await dbPromise()
    const results = await db.run(statement)
    if (results.changes === 0) throw Error('Invalid userKey')
    res.json({ success: true, eventKey, message: 'Created event successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) db.close()
  }
})

router.delete('/delete', async (req, res, next) => {
  let db
  try {
    if (!req.body.eventKey || Object.keys(req.body).length !== 1) throw Error('request fields are incorrect')
    const statement = SQL`
      DELETE
      FROM event
      WHERE event.key = ${req.body.eventKey}
    `
    db = await dbPromise()
    const results = await db.run(statement)
    if (results.changes === 0) throw Error('Invalid eventKey')
    res.json({ success: true, message: 'Deleted event successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) db.close()
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  let db
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['eventKey', 'name', 'location', 'dateOf']
    if (!reqFieldNames.includes('eventKey') || reqFieldNames.length < 2 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    db = await dbPromise()
    const dbUpdates =
      reqFieldNames
        .filter((fieldName) => fieldName !== 'eventKey')
        .map((fieldName) => SQL`
          UPDATE event
          SET `.append(fieldName).append(SQL` = ${req.body[fieldName]}
          WHERE event.key = ${req.body.eventKey}`))
        .map((statement) => db.run(statement))
    const results = await Promise.all(dbUpdates)
    results.forEach(result => {
      if (result.changes === 0) throw Error("Event key doesn't exist")
    })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) db.close()
  }
})

// can only change one thing at a time
router.put('/privacy/update', async (req, res, next) => {
  let db
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['eventKey', 'displayAddress', 'displayDate', 'visibility']
    if (!reqFieldNames.includes('eventKey') || reqFieldNames.length < 2 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    db = await dbPromise()
    const dbUpdates =
      reqFieldNames
        .filter(fieldName => fieldName !== 'eventKey')
        .map(fieldName => SQL`
          UPDATE eventPrivacy
          SET `.append(fieldName).append(SQL` = ${req.body[fieldName]}
          WHERE eventPrivacy.eventID = (
            SELECT (rowid) 
            FROM event 
            WHERE event.key = ${req.body.eventKey}
          )`)
        )
        .map(statement => db.run(statement))
    const results = await Promise.all(dbUpdates)
    results.forEach(result => {
      if (result.changes === 0) throw Error("Event key doesn't exist")
    })
    res.json({ success: true, message: 'Updated event privacy successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) db.close()
  }
})

module.exports = router

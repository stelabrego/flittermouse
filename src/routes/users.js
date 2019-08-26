const express = require('express')
const router = express.Router()
const dbLib = require('../lib/dbLib')
const SQL = require('sql-template-strings')

router.post('/add', async (req, res, next) => {
  try {
    await dbLib.insertUser(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.delete('/delete', async (req, res, next) => {
  try {
    // if (!req.body.userKey || Object.keys(req.body).length !== 1) throw Error('request fields are incorrect')
    await dbLib.deleteUser(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  let db
  try {
    // const reqFieldNames = Object.keys(req.body)
    // const validFieldNames = ['userKey', 'username', 'password', 'email', 'displayName', 'phoneNumber', 'address', 'bio']
    // if (!reqFieldNames.includes('userKey') || reqFieldNames.length < 2 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    db = await dbPromise()
    const dbUpdates =
      reqFieldNames
        .filter((fieldName) => fieldName !== 'userKey')
        .map((fieldName) => SQL`
            UPDATE user
            SET `.append(fieldName).append(SQL` = ${req.body[fieldName]}
            WHERE user.key = ${req.body.userKey}
          `)
        )
        .map((statement) => db.run(statement))
    const results = await Promise.all(dbUpdates)
    results.forEach(result => {
      if (result.changes === 0) throw Error("User key doesn't exist")
    })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) db.close()
  }
})

router.put('/privacy/update', async (req, res, next) => {
  let db
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['userKey', 'subscribedEventsVisibility', 'addressVisibility', 'nameVisibility', 'emailVisibility', 'phoneNumberVisibility']
    if (!reqFieldNames.includes('userKey') || reqFieldNames.length < 2 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    db = await dbPromise()
    const dbUpdates =
      reqFieldNames
        .filter(fieldName => fieldName !== 'userKey')
        .map(fieldName => SQL`
          UPDATE userPrivacy
          SET `.append(fieldName).append(SQL` = ${req.body[fieldName]}
          WHERE userPrivacy.userId = (
          SELECT (rowId)
          FROM user
          WHERE user.key = ${req.body.userKey})`)
        )
        .map(statement => db.run(statement))
    const results = await Promise.all(dbUpdates)
    results.forEach(result => {
      if (result.changes === 0) throw Error("User key doesn't exist")
    })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) db.close()
  }
})

module.exports = router

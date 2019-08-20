const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const dbPromise = require('../lib/dbPromise')
const SQL = require('sql-template-strings')

router.post('/add', async (req, res, next) => {
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['username', 'password', 'email', 'displayName', 'phoneNumber', 'address', 'avatarUrl', 'bio']
    if (reqFieldNames.length < 1 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    const userKey = crypto.randomBytes(6).toString('hex')
    const reqValues = validFieldNames.reduce((result, column) => {
      result[column] = req.body[column] || null
      return result
    }, { userKey })
    const statement = SQL`
      INSERT
      INTO    user
              (username, password, email, key, displayName, phoneNumber, address, avatarUrl, bio)
      VALUES  (${reqValues.username}, ${reqValues.password}, ${reqValues.email}, ${reqValues.userKey}, ${reqValues.displayName},
                ${reqValues.phoneNumber}, ${reqValues.address}, ${reqValues.avatarUrl}, ${reqValues.bio})
    `
    const db = await dbPromise()
    const results = await db.run(statement)
    await db.run('INSERT INTO userPrivacy (userID) VALUES (?)', results.lastID)
    res.json({ success: true, userKey, message: 'Created new user successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.delete('/delete', async (req, res, next) => {
  try {
    if (!req.body.userKey || Object.keys(req.body).length !== 1) throw Error('request fields are incorrect')
    const statement = SQL`
      DELETE
      FROM user
      WHERE user.key = ${req.body.userKey}
    `
    const db = await dbPromise()
    const results = await db.run(statement)
    if (results.changes === 0) throw Error("User key doesn't exist")
    res.json({ success: true, message: 'Deleted user successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['userKey', 'username', 'password', 'email', 'displayName', 'phoneNumber', 'address', 'bio']
    if (!reqFieldNames.includes('userKey') || reqFieldNames.length < 2 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    const db = await dbPromise()
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
    res.json({ success: true, message: 'Updated user successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.put('/privacy/update', async (req, res, next) => {
  try {
    const reqFieldNames = Object.keys(req.body)
    const validFieldNames = ['userKey', 'subscribedEventsVisibility', 'addressVisibility', 'nameVisibility', 'emailVisibility', 'phoneNumberVisibility']
    if (!reqFieldNames.includes('userKey') || reqFieldNames.length < 2 || !reqFieldNames.every((field) => validFieldNames.includes(field))) { throw Error('Incorrect request fields') }
    const db = await dbPromise()
    const dbUpdates =
      reqFieldNames
        .filter(fieldName => fieldName !== 'userKey')
        .map(fieldName => SQL`
          UPDATE userPrivacy
          SET `.append(fieldName).append(SQL` = ${req.body[fieldName]}
          WHERE userPrivacy.userID = (
          SELECT (rowID)
          FROM user
          WHERE user.key = ${req.body.userKey})`)
        )
        .map(statement => db.run(statement))
    const results = await Promise.all(dbUpdates)
    results.forEach(result => {
      if (result.changes === 0) throw Error("User key doesn't exist")
    })
    res.json({ success: true, message: 'Updated user privacy successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

module.exports = router

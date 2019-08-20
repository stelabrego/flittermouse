const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const dbPromise = require('../lib/dbPromise')
const SQL = require('sql-template-strings')

router.post('/add', async (req, res, next) => {
  try {
    const userKey = crypto.randomBytes(6).toString('hex')
    const columns = ['username', 'password', 'email', 'displayName', 'phoneNumber', 'address', 'avatarUrl', 'bio']
    const values = columns.reduce((prev, curr) => {
      prev[curr] = req.body[curr] || null
      return prev
    }, { key: userKey })
    const statement = SQL`
      INSERT
      INTO    user
              (username, password, email, key, displayName, phoneNumber, address, avatarUrl, bio)
      VALUES  (${values.username}, ${values.password}, ${values.email}, ${values.key}, ${values.displayName},
                ${values.phoneNumber}, ${values.address}, ${values.avatarUrl}, ${values.bio})
    `
    const db = await dbPromise
    const results = await db.run(statement)
    await db.run('INSERT INTO userPrivacy (userID) VALUES (?)', results.lastID)
    res.json({ success: true, userKey, message: 'Created new user successfully' })
    await db.close()
  } catch (err) {
    res.json({ success: false, message: err.message })
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
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error("User key doesn't exist")
    res.json({ success: true, message: 'Deleted user successfully' })
    await db.close()
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  try {
    const columns = ['username', 'password', 'email', 'displayName', 'phoneNumber', 'address', 'bio']
    const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
      if (columns.includes(curr)) return curr
    }, null)
    if (!targetColumn || !req.body.userKey || Object.keys(req.body).length !== 2) throw Error('request keys are not correct')
    const statement = SQL`
      UPDATE user
      SET `.append(targetColumn).append(SQL` = ${req.body[targetColumn]}
      WHERE user.key = ${req.body.userKey}
    `)
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error("User key doesn't exist")
    res.json({ success: true, message: 'Updated user successfully' })
    await db.close()
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.put('/privacy/update', async (req, res, next) => {
  try {
    const columns = ['subscribedEventsVisibility', 'addressVisibility', 'nameVisibility', 'emailVisibility', 'phoneNumberVisibility']
    const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
      if (columns.includes(curr)) return curr
    }, null)
    if (!targetColumn || !req.body.userKey || Object.keys(req.body).length !== 2) throw Error('request keys are not correct')
    const statement = SQL`
      UPDATE userPrivacy
      SET `.append(targetColumn).append(SQL` = ${req.body[targetColumn]}
      WHERE userPrivacy.userID = (
        SELECT (rowID)
        FROM user
        WHERE user.key = ${req.body.userKey}
      )
    `)
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) throw Error("User key doesn't exist")
    res.json({ success: true, message: 'Updated user privacy successfully' })
    await db.close()
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

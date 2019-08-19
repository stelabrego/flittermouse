const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const getDatabase = require('../lib/getDatabase')
const dbPromise = require('../lib/dbPromise')
const SQL = require('sql-template-strings')

router.post('/add', async (req, res, next) => {
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
  try {
    const db = await dbPromise
    const results = await db.run(statement)
    await db.run('INSERT INTO userPrivacy (userID) VALUES (?)', results.lastID)
    res.json({ success: true, userKey, message: 'Created new user successfully' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.delete('/delete', async (req, res, next) => {
  if (!res.body.userKey || Object.keys(res.body) !== 1) {
    res.json({ success: false, message: 'request fields are incorrect' })
    return
  }
  const statement = SQL`
    DELETE
    FROM user
    WHERE user.key = ${res.body.userKey}
  `
  try {
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) res.json({ success: false, message: "User key doesn't exist" })
    else res.json({ success: true, message: 'Deleted user successfully' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  const columns = ['username', 'password', 'email', 'displayName', 'phoneNumber', 'address', 'bio']
  const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
    if (columns.includes(curr)) return curr
  }, null)
  if (!targetColumn || !req.body.userKey || Object.keys(req.body).length !== 2) {
    res.json({ success: false, message: 'request keys are not correct' })
    return
  }
  const statement = SQL`
    UPDATE user
    SET `.append(targetColumn).append(SQL` = ${req.body[targetColumn]}
    WHERE user.key = ${req.body.userKey}
  `)
  try {
    const db = await dbPromise
    const results = await db.run(statement)
    if (results.changes === 0) res.json({ success: false, message: "User key doesn't exist" })
    else res.json({ success: true, message: 'Updated user successfully' })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.put('/privacy/update', (req, res, next) => {
  const columns = ['subscribedEventsVisibility', 'addressVisibility', 'nameVisibility', 'emailVisibility', 'phoneNumberVisibility']
  const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
    if (columns.includes(curr)) return curr
  }, null)
  if (!targetColumn || !req.body.eventKey || Object.keys(req.body).length !== 2) {
    res.json({ success: false, message: 'request keys are not correct' })
  }
  const statement = `UPDATE userPrivacy SET ${targetColumn} = $newValue WHERE userPrivacy.userID = (SELECT (rowID) FROM user WHERE user.key = $userKey)`
  const values = { $userKey: req.body.userKey, $newValue: req.body[targetColumn] }
  // const db = getDatabase((err) => {
  //   res.json({ success: false, message: err.message })
  // })
  // db.run(statement, values, function (err) {
  //   console.log(err)
  //   if (err) res.json({ success: false, message: err.message })
  //   else if (this.changes === 0) res.json({ success: false, message: "User key doesn't exist" })
  //   else res.json({ success: true, message: 'Updated user privacy successfully' })
  // })
  // db.close()
})

module.exports = router

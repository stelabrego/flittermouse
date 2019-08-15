const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const getDatabase = require('../lib/getDatabase')

router.post('/add', function (req, res, next) {
  const userKey = crypto.randomBytes(6).toString('hex')
  const columns = ['username', 'password', 'email', 'display_name', 'phone_number', 'address', 'avatar_url', 'bio']
  const values = columns.reduce((prev, curr) => {
    prev['$' + curr] = req.body[curr] || null
    return prev
  }, { $key: userKey })
  const statement = 'INSERT INTO user (username, password, email, key, display_name, phone_number, address, avatar_url, bio) VALUES ($username, $password, $email, $key, $display_name, $phone_number, $address, $avatar_url, $bio)'
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  // callback can't be lambda because lambdas use a new this object which makes this.lastID undefined
  db.run(statement, values, function (err) {
    if (err) res.send({ success: false, message: err.message })
    else {
      db.run('INSERT INTO user_privacy (user_id) VALUES (?)', this.lastID, (err) => {
        if (err) res.send({ success: false, message: err.message })
        else res.send({ success: true, userKey, message: 'Created new user successfully' })
      })
    }
  })
  db.close()
})

router.delete('/delete', (req, res, next) => {
  const statement = 'DELETE FROM user WHERE user.key = ?'
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  db.run(statement, req.body.userKey, function (err) {
    if (err || this.changes === 0) res.send({ success: false, message: 'Could not delete user' })
    else res.send({ success: true, message: 'Deleted user successfully' })
  })
})

// can only change one thing at a time
router.put('/update', (req, res, next) => {
  const columns = ['username', 'password', 'email', 'display_name', 'phone_number', 'address', 'bio']
  const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
    if (columns.includes(curr)) return curr
  }, null)
  if (!targetColumn || !req.body.userKey || Object.keys(req.body).length !== 2) {
    res.send({ success: false, message: 'request keys are not correct' })
  }
  const statement = `UPDATE user SET ${targetColumn} = $newValue WHERE user.key = $userKey`
  const values = { $userKey: req.body.userKey, $newValue: req.body[targetColumn] }
  console.log(values)
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  db.run(statement, values, function (err) {
    if (err) res.send({ success: false, message: err.message })
    else res.send({ success: true, message: 'Updated user successfully' })
  })
})

router.put('/privacy/update', (req, res, next) => {
  const columns = ['display_address', 'display_date', 'visibility']
  const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
    if (columns.includes(curr)) return curr
  }, null)
  if (!targetColumn || !req.body.eventKey || Object.keys(req.body).length !== 2) {
    res.send({ success: false, message: 'request keys are not correct' })
  }
  const statement = `UPDATE event_privacy SET ${targetColumn} = $newValue WHERE event_privacy.event_id = (SELECT (rowid) FROM event WHERE event.key = $eventKey)`
  const values = { $eventKey: req.body.eventKey, $newValue: req.body[targetColumn] }
  console.log(values)
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  db.run(statement, values, function (err) {
    console.log(err)
    if (err) res.send({ success: false, message: err.message })
    else res.send({ success: true, message: 'Updated event successfully' })
  })
})

module.exports = router

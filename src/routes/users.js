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

module.exports = router

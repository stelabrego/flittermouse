const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const getDatabase = require('../lib/getDatabase')

// Add event
router.post('/add', function (req, res, next) {
  const eventKey = crypto.randomBytes(6).toString('hex')
  const columns = ['user_id', 'name', 'date_of', 'address']
  const values = columns.reduce((prev, curr) => {
    prev['$' + curr] = req.body[curr] || null
    return prev
  }, { $key: eventKey })
  const statement = 'INSERT INTO event (user_id, name, key, date_of, address) VALUES ($user_id, $name, $key, $date_of, $address)'
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  // callback can't be lambda because lambdas use a new this object which makes this.lastID undefined
  db.run(statement, values, function (err) {
    if (err) res.send({ success: false, message: err.message })
    else {
      db.run('INSERT INTO event_privacy (event_id) VALUES (?)', this.lastID, (err) => {
        if (err) res.send({ success: false, message: err.message })
        else res.send({ success: true, eventKey, message: 'Created event successfully' })
      })
    }
  })
  db.close()
})

router.delete('/delete', (req, res, next) => {
  const statement = 'DELETE FROM event WHERE event.key = ?'
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  db.run(statement, req.body.eventKey, function (err) {
    if (err || this.changes === 0) res.send({ success: false, message: 'Could not delete event' })
    else res.send({ success: true, message: 'Deleted event successfully' })
  })
  db.close()
})

// can only change one thing at a time
router.put('/update', (req, res, next) => {
  const columns = ['name', 'location', 'dateOf']
  const targetColumn = Object.keys(req.body).reduce((prev, curr) => {
    if (columns.includes(curr)) return curr
  }, null)
  if (!targetColumn || !req.body.eventKey || Object.keys(req.body).length !== 2) {
    res.send({ success: false, message: 'request keys are not correct' })
  }
  const statement = `UPDATE event SET ${targetColumn} = $newValue WHERE event.key = $eventKey`
  const values = { $eventKey: req.body.eventKey, $newValue: req.body[targetColumn] }
  console.log(values)
  const db = getDatabase((err) => {
    res.send({ success: false, message: err.message })
  })
  db.run(statement, values, function (err) {
    if (err || this.changes === 0) res.send({ success: false, message: 'Could not update user', err: err.message })
    else res.send({ success: true, message: 'Updated event successfully' })
  })
})

module.exports = router

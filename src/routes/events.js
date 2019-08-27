const express = require('express')
const router = express.Router()
const dbLib = require('../lib/dbLib')
// Add event
router.post('/add', async (req, res, next) => {
  try {
    await dbLib.insertEvent(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.delete('/delete', async (req, res, next) => {
  try {
    await dbLib.deleteEvent(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/update', async (req, res, next) => {
  try {
    await dbLib.updateEvent(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// can only change one thing at a time
router.put('/privacy/update', async (req, res, next) => {
  try {
    await dbLib.updateEventPrivacy(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

module.exports = router

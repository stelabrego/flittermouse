const express = require('express')
const router = express.Router()
const dbLib = require('../lib/dbLib')

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
    await dbLib.deleteUser(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.put('/update', async (req, res, next) => {
  try {
    await dbLib.updateUser(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

router.put('/privacy/update', async (req, res, next) => {
  try {
    await dbLib.updateUserPrivacy(req.body, err => { throw err })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

module.exports = router

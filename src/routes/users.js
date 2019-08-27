const express = require('express')
const router = express.Router()
const dbPromise = require('../lib/dbPromise')

router.post('/add', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.insertUser(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

router.delete('/delete', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.deleteUser(req.body.id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

router.put('/update', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.updateUser(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

router.put('/privacy/update', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise(err => { throw err })
    await db.updateUserPrivacy(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

module.exports = router

const express = require('express')
const router = express.Router()
const dbPromise = require('../lib/dbPromise')

router.post('/attend', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    if (!sessionUser) {
      res.json({ success: false, needToLogin: true })
    } else {
      const { urlKey } = req.body
      console.log(urlKey)
      const db = await dbPromise(next)
      const event = await db.selectEventByUrlKey(urlKey)
      console.log(event)
      await db.insertAttendance({ userId: sessionUser.id, eventId: event.id })
      res.json({ success: true })
    }
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.delete('/attend', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    const urlKey = req.body.urlKey
    const db = await dbPromise(next)
    const event = await db.selectEventByUrlKey(urlKey)
    const allUserAttendance = await db.selectAttendanceByUserId(sessionUser.id)
    const targetAttendance = allUserAttendance.filter(attendance => attendance.eventId === event.id)[0]
    await db.deleteAttendance(targetAttendance.id)
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

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

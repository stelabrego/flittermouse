const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()
var multer = require('multer')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const crypto = require('crypto')

router.post('/attend', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    if (!sessionUser) {
      res.json({ success: false, needToLogin: true })
    } else {
      const { urlKey } = req.body
      console.log(urlKey)
      const db = await dbPromise()
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
    const db = await dbPromise()
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
    const db = await dbPromise()
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
    const db = await dbPromise()
    await db.deleteUser(req.body.id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

router.post('/update', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals

    const {
      STORAGE_ENDPOINT = 'digitaloceanspaces.com',
      REGION = 'nyc3',
      BUCKET_NAME = 'eventz'
    } = process.env

    const spacesEndpoint = new aws.Endpoint(`https://${REGION}.${STORAGE_ENDPOINT}`)
    const s3 = new aws.S3({
      endpoint: spacesEndpoint
    })
    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: 'public-read',
        key: function (req, file, cb) {
          let key = crypto.randomBytes(6).toString('hex')
          key += file.mimetype === 'image/jpeg' ? '.jpeg' : '.png'
          cb(null, key)
        }
      }),
      fileFilter: (req, file, cb) => {
        const mimeTypes = ['image/jpeg', 'image/png']
        if (!mimeTypes.includes(file.mimetype)) cb(Error('File is not jpeg or png'))
        cb(null, true)
      },
      limits: {
        files: 1
      }
    }).single('avatar')

    upload(req, res, async (err) => {
      if (err) throw err
      let dbUpdate = { id: sessionUser.id, ...req.body }
      // I gues res.req.file is how you get the file info after it's processed? So weird. Not in the docs.
      let avatarUrl
      if (res.req.file) {
        const avatarFilename = res.req.file.key
        avatarUrl = `https://${BUCKET_NAME}.${REGION}.cdn.${STORAGE_ENDPOINT}/${avatarFilename}`
        dbUpdate = { avatarUrl, ...dbUpdate }
      }
      const db = await dbPromise()
      console.log(dbUpdate)
      await db.updateUser(dbUpdate)
      if (avatarUrl) res.json({ success: true, avatarUrl })
      else res.json({ success: true })
    })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.put('/privacy/update', async (req, res, next) => {
  let db
  try {
    const db = await dbPromise()
    await db.updateUserSetting(req.body)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  } finally {
    if (db) await db.close()
  }
})

module.exports = router

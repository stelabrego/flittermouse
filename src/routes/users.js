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
      const result = await db.query('INSERT INTO attendance (user_id, event_id) SELECT $1, event_id FROM events WHERE url_key = $2 RETURNING *', [sessionUser.user_id, urlKey])
      if (result.rows.length === 0) throw Error('Did not insert row')
      res.json({ success: true })
    }
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.delete('/attend', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    if (!sessionUser) {
      res.json({ success: false, needToLogin: true })
    } else {
      const { urlKey } = req.body
      const result = await db.query('DELETE FROM attendance WHERE user_id = $1 AND event_id = (SELECT event_id FROM events WHERE url_key = $2) RETURNING *', [sessionUser.user_id, urlKey])
      if (result.rows.length === 0) throw Error('Did not delete row')
      res.json({ success: true })
    }
  } catch (err) {
    res.json({ success: false, message: err.message })
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
        contentType: multerS3.AUTO_CONTENT_TYPE,
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
      // I gues res.req.file is how you get the file info after it's processed? So weird. Not in the docs.
      let avatarUrl = null
      if (res.req.file) {
        const avatarFilename = res.req.file.key
        avatarUrl = `https://${BUCKET_NAME}.${REGION}.cdn.${STORAGE_ENDPOINT}/${avatarFilename}`
      }
      // COALESCE function will set avatar_url to it's current value (so basically ignore it) if the passed in avatarUrl === null
      await db.query('UPDATE users SET avatar_url = COALESCE($1, avatar_url), display_name = $2, bio = $3 WHERE user_id = $4', [avatarUrl, req.body.displayName, req.body.bio, sessionUser.user_id])
      res.json({ success: true, avatarUrl })
    })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

router.post('/follow', async (req, res, next) => {
  let needToLogin
  try {
    const { sessionUser } = res.locals
    if (!sessionUser) {
      needToLogin = true
      throw Error('Needs to login')
    }
    const { targetUserId } = req.body
    const result = await db.query("INSERT INTO user_relationships (initial_user_id, target_user_id, relationship) VALUES ($1, $2, 'follow') ON CONFLICT ON CONSTRAINT user_relationships_pkey DO UPDATE SET relationship = 'follow' WHERE user_relationships.initial_user_id = $1 AND user_relationships.target_user_id = $2 RETURNING *", [sessionUser.user_id, targetUserId])
    if (result.rows.length === 0) throw Error('Could not insert or update')
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message, needToLogin })
  }
})

router.delete('/follow', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    const { targetUserId } = req.body
    const result = await db.query('DELETE FROM user_relationships WHERE initial_user_id = $1 AND target_user_id = $2 RETURNING *', [sessionUser.user_id, targetUserId])
    if (result.rows.length === 0) throw Error('Could not insert or update')
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

const redirectIndex = async (req, res, next) => {
  if (!res.locals.sessionUser) res.redirect('/')
  else next()
}

router.get('/', redirectIndex, async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    const result = await db.query('SELECT * FROM user_settings WHERE user_id = $1', [sessionUser.user_id])
    const userSetting = result.rows[0]
    res.render('settings', { sessionUser, userSetting })
  } catch (err) {
    next(err)
  }
})

router.post('/privacy', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    if (!sessionUser) throw Error('Not logged in')
    const queryValues = [
      req.body.displayNameVisibility,
      req.body.avatarVisibility,
      req.body.bioVisibility,
      req.body.emailVisibility,
      req.body.attendingVisibility,
      req.body.followingVisibility,
      sessionUser.user_id
    ]
    console.log(queryValues)
    const result = await db.query('UPDATE user_settings SET display_name_visibility = $1, avatar_visibility = $2, bio_visibility = $3, email_visibility = $4, attending_visibility = $5, following_visibility = $6 WHERE user_id = $7 RETURNING *', queryValues)
    if (result.rows.length === 0) throw Error('Updated zero rows')
    res.json({ success: true })
  } catch (err) {
    console.error(err.stack)
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

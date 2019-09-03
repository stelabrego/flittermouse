const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    const result = await db.query('SELECT * FROM user_settings WHERE user_id = $1', [sessionUser.user_id])
    const userSetting = result.rows[0]
    res.render('settings', { sessionUser, userSetting })
  } catch (err) {
    next(err)
  }
})

module.exports = router

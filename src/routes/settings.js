const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    const db = await dbPromise()
    const userSetting = db.selectUserSettingByUserId(sessionUser.userId)
    res.render('settings', { sessionUser, userSetting })
  } catch (err) {
    next(err)
  }
})

module.exports = router

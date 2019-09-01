var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const { sessionUser } = res.locals
    const db = await dbPromise()
    const userSetting = db.selectUserSettingByUserId(sessionUser.id)
    res.render('settings', { sessionUser, userSetting })
  } catch (err) {
    next(err)
  }
})

module.exports = router

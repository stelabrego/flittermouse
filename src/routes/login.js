var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

router.post('/', async (req, res, next) => {
  try {
    const db = await dbPromise(err => { throw err })
    let user = await db.selectUserByUsername(req.body.usernameEmail)
    if (!user) user = await db.selectUserByEmail(req.body.usernameEmail)
    if (!user) throw Error('Incorrect username or password')
    if (user.password !== req.body.password) throw Error('Incorrect username or password')
    req.session.userId = user.id
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body)
    const db = await dbPromise(err => { throw err })
    let results = await db.selectUserByUsername(req.body.usernameEmail)
    console.log(results)
    if (results.length === 0) results = await db.selectUserByEmail(req.body.usernameEmail)
    if (results.length === 0) throw Error('Incorrect username or password')
    const user = results[0]
    if (user.password !== req.body.password) throw Error('Incorrect username or password')
    req.session.userId = user.id
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

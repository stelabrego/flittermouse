const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.post('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE userId = $1 AND password = $2', [req.body.usernameEmail, req.body.password])
    const user = result.rows[0]
    req.session.userId = user.userId
    res.json({ success: true })
  } catch (err) {
    console.error(err.stack)
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

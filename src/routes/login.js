const Router = require('express-promise-router')
const db = require('../db')
const router = new Router()

router.post('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE (username = $1 AND (password_hash = crypt($2, password_hash))) OR (email = $1 AND (password_hash = crypt($2, password_hash))) LIMIT 1', [req.body.usernameEmail, req.body.password])
    const user = result.rows[0]
    req.session.userId = user.user_id
    console.log('Added user_id to session for user: ', JSON.stringify(user))
    res.json({ success: true })
  } catch (err) {
    console.error(err.stack)
    res.json({ success: false, message: err.message })
  }
})

module.exports = router

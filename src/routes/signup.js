const Router = require('express-promise-router')
const db = require('../db')
const validate = require('../validate')
const generate = require('nanoid/generate')
const nolookalikes = require('nanoid-dictionary/nolookalikes')
const router = new Router()

router.post('/', async function (req, res, next) {
  const invalidInputFields = []
  try {
    const { sessionUser } = res.locals
    if (sessionUser) throw Error('Already logged in')
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    if (!validate.username(username)) invalidInputFields.push('username')
    if (!validate.email(email)) invalidInputFields.push('email')
    if (!validate.password(password)) invalidInputFields.push('password')
    if (invalidInputFields.length > 0) throw Error('Invalid input fields')
    const inviteKey = generate(nolookalikes, 6)
    const result = await db.query("INSERT INTO users (username, email, invite_key, password_hash) VALUES ($1, $2, $3, crypt($4, gen_salt('md5'))) RETURNING *", [username, email, inviteKey, password])
    if (result.rows.length === 0) throw Error('Could not insert into database')
    req.session.userId = result.rows[0].user_id
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message, invalidInputFields })
  }
})

module.exports = router

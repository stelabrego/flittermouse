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

    if (!validate.username(username)) invalidInputFields.push({ name: 'username', message: 'Your username is too short or contains restricted characters.' })
    if (!validate.email(email)) invalidInputFields.push({ name: 'email', message: 'Your email address is unrecognizable.' })
    if (!validate.password(password)) invalidInputFields.push({ name: 'password', message: 'Your password is too short.' })

    let result = await db.query('SELECT * FROM users WHERE username = $1', [username])
    const usernameErrorExists = invalidInputFields.some(error => error.name === 'username')
    if (result.rows.length > 0 && !usernameErrorExists) invalidInputFields.push({ name: 'username', message: 'Username already taken' })

    result = await db.query('SELECT * FROM users WHERE email = $1', [email])
    const emailErrorExists = invalidInputFields.some(error => error.name === 'email')
    if (result.rows.length > 0 && !emailErrorExists) invalidInputFields.push({ name: 'email', message: 'Email already taken' })

    if (invalidInputFields.length > 0) throw Error('Input fields invalid')

    const inviteKey = generate(nolookalikes, 6)
    result = await db.query("INSERT INTO users (username, email, invite_key, password_hash) VALUES ($1, $2, $3, crypt($4, gen_salt('md5'))) RETURNING *", [username, email, inviteKey, password])
    if (result.rows.length === 0) throw Error('Could not insert into database')
    req.session.userId = result.rows[0].user_id
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, message: err.message, invalidInputFields })
  }
})

module.exports = router

const db = require('../db')
const Router = require('express-promise-router')
const router = new Router()

router.get('/', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    let { query: queryString } = req.query
    if (!queryString) queryString = ''
    const queryTokens = queryString.split(' ')
    const eventPromises = queryTokens.map((token) => {
      return db.query("SELECT * FROM events WHERE ( name LIKE '%' || $1 || '%' ) OR event_id IN (SELECT event_id FROM event_tags WHERE event_tags.name LIKE '%' || $1 || '%')", [token])
    })
    let results = await Promise.all(eventPromises)
    const matchedEvents = results.reduce((aggregate, result) => {
      return aggregate.concat(result.rows)
    }, [])

    const userPromises = queryTokens.map((token) => {
      return db.query("SELECT * FROM users WHERE ( username LIKE '%' || $1 || '%' )", [token])
    })
    results = await Promise.all(userPromises)
    const matchedUsers = results.reduce((aggregate, result) => {
      return aggregate.concat(result.rows)
    }, [])

    console.log(matchedEvents, matchedUsers)
    res.render('search', { sessionUser, matchedEvents, matchedUsers })
  } catch (err) {
    next(err)
  }
})

module.exports = router

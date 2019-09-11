const db = require('../db')
const Router = require('express-promise-router')
const router = new Router()

router.get('/', async (req, res, next) => {
  try {
    const { sessionUser } = res.locals
    let { query: queryString } = req.query
    if (queryString) queryString = queryString.trim()
    let matchedEvents, matchedUsers
    if (queryString) {
      const queryTokens = queryString.toLowerCase().split(' ')
      const eventPromises = queryTokens.map((token) => {
        return db.query("SELECT * FROM events WHERE ( LOWER(name) LIKE '%' || $1 || '%' ) OR event_id IN (SELECT event_id FROM event_tags WHERE event_tags.name LIKE '%' || $1 || '%')", [token])
      })
      let results = await Promise.all(eventPromises)
      matchedEvents = results.reduce((aggregate, result) => {
        return aggregate.concat(result.rows)
      }, [])

      const userPromises = queryTokens.map((token) => {
        return db.query("SELECT * FROM users WHERE ( LOWER(username) LIKE '%' || $1 || '%' )", [token])
      })
      results = await Promise.all(userPromises)
      matchedUsers = results.reduce((aggregate, result) => {
        return aggregate.concat(result.rows)
      }, [])
    } else {
      matchedEvents = []
      matchedUsers = []
    }
    console.log(matchedEvents, matchedUsers)
    res.render('search', { sessionUser, matchedEvents, matchedUsers })
  } catch (err) {
    next(err)
  }
})

module.exports = router

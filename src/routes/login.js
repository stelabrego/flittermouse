var express = require('express')
var router = express.Router()
const dbPromise = require('../lib/dbPromise')

/* GET home page. */
router.post('/', async (req, res, next) => {
  res.json({ hi: 'there client' })
})

module.exports = router

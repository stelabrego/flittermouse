var express = require('express')
var router = express.Router()

router.post('/', (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
  })
  res.json({ success: true })
})

module.exports = router

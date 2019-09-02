const Router = require('express-promise-router')
const router = new Router()

router.post('/', async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err.stack)
      res.json({ success: false })
    } else res.json({ success: true })
  })
})

module.exports = router

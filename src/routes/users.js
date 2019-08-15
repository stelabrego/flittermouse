let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let getDatabase = require('../lib/getDatabase')

// Add user
router.post('/add', function (req, res, next) {
  let userKey = crypto.randomBytes(6).toString('hex');
  let columns = ['username', 'password', 'email', 'display_name', 'phone_number', 'address', 'avatar_url', 'bio']
  let values = columns.reduce((prev, curr) => {
    prev['$' + curr] = req.body[curr] || null;
    return prev;
  }, { $key: userKey });
  let statement = "INSERT INTO user (username, password, email, key, display_name, phone_number, address, avatar_url, bio) VALUES ($username, $password, $email, $key, $display_name, $phone_number, $address, $avatar_url, $bio)";
  let db = getDatabase((err) => {
    res.send({ success: false, message: err.message });
  });
  db.run(statement, values, function (err) {
    if (err) res.send({ success: false, message: err.message });
    else {
      db.run('INSERT INTO user_privacy (user_id) VALUES (?)', this.lastID, (err) => {
        if (err) res.send({ success: false, message: err.message });
        else res.send({ success: true });
      });
    }
  });
  db.close();
});

module.exports = router;

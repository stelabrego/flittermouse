let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let getDatabase = require('../lib/getDatabase')

// Add event
router.post('/add', function (req, res, next) {
    let eventKey = crypto.randomBytes(6).toString('hex');
    let columns = ['user_id', 'name', 'date_of', 'address']
    let values = columns.reduce((prev, curr) => {
        prev['$' + curr] = req.body[curr] || null;
        return prev;
    }, { $key: eventKey });
    let statement = "INSERT INTO event (user_id, name, key, date_of, address) VALUES ($user_id, $name, $key, $date_of, $address)";
    let db = getDatabase((err) => {
        res.send({ success: false, message: err.message });
    })
    // callback can't be lambda because lambdas use a new this object which makes this.lastID undefined
    db.run(statement, values, function (err) {
        if (err) res.send({ success: false, message: err.message });
        else {
            db.run('INSERT INTO event_privacy (event_id) VALUES (?)', this.lastID, (err) => {
                if (err) res.send({ success: false, message: err.message });
                else res.send({ success: true });
            });
        }
    });
    db.close();
});

module.exports = router;
// sqlstring is WAY better then sqlite3 or sql-template-strings because it accepts an object param
// with properties that don't need to be referenced in the sql string. this way, you don't have to write
// out all the column names at all. So much simpler! Updates don't have to be multiple statements now.
// FUCK SQL STRING IT DOESN'T EVEN ESCAPE SINGLE QUOTATION MARKS RIGHT '' GODDDDD

// await this.insertUser({ id: 1, username: 'stel', email: 'stel@gmail.com', password: '1', display_name: 'Stel Abrego', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur, nisi sed venenatis hendrerit, erat justo condimentum arcu, id semper tellus erat vel magna.' })
// await this.insertUser({ id: 2, username: 'alice', email: 'alice@gmail.com', password: '1' })
// await this.insertUser({ id: 3, username: 'ash', email: 'ash@gmail.com', password: '1' })
// await this.insertEvent({ id: 1, url_key: 'test', user_id: 1, name: 'stels big party', address: '306 N Adams St Ypsilanti', lat: 42.245083, lon: -83.615924, description: 'Were really just gonna smoke weed and compliment eachother', date_start: '2019-10-31 18:00', date_end: '2019-10-31 23:00' })
// await this.insertEvent({ id: 2, url_key: 'test2', user_id: 2, name: 'alices christmas party', description: 'Bring your best ugly sweaters', date_start: '2019-12-25 08:00', date_end: '2019-12-25 20:00' })
// await this.insertUserRelationship({ initial_user_id: 1, target_user_id: 2, relationship: 'listen' })
// await this.insertAttendance({ user_id: 1, event_id: 2 })
// await this.insertEventTag({ event_id: 1, name: 'party' })
// await this.insertEventTag({ event_id: 1, name: 'christmas' })
// await this.insertEventTag({ event_id: 2, name: 'party' })
// await this.insertEventTag({ event_id: 2, name: 'BYOB' })
// await this.insertEventQuestion({ event_id: 1, user_id: 2, question: 'Can I bring Lucha?', answer: 'Yes, Indi would love that', visible: 1 })

// user.invite_key = crypto.randomBytes(3).toString('hex')

const db = require('./index')

module.exports = async () => {
  try {
    const result = await db.query('SELECT * FROM users')
    if (result.rows.length === 0) {
      await db.query(`INSERT INTO users (user_id, username, email, password_hash, invite_key, display_name, bio) VALUES
        (1, 'stel', 'stel@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key1', 'Stel Abrego', 'I''m here and I''m queer'),
        (2, 'alice', 'alice@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key2', 'sexyalice666', 'I like movies'),
        (3, 'ash', 'ash@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key3', 'ashthisblunt', 'smoke')
      `)
      await db.query(`INSERT INTO events (event_id, user_id, url_key, name, location, lat, lon, description, date_start, date_end) VALUES
        (1, 1, 'test', 'stels big party', '306 N Adams St Ypsilanti', 42.245083, -83.615924, 'We''re really just gonna smoke weed and compliment eachother', '2019-10-31 18:00', '2019-10-31 23:00'),
        (2, 2, 'test2', 'alices christmas party', DEFAULT, NULL, NULL, 'Bring your best ugly sweaters', '2019-12-25 08:00', '2019-12-25 20:00')
      `)
      return true
    }
  } catch (err) {
    console.error(err.stack)
  }
  return false
}

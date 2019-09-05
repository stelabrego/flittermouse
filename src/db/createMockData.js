const db = require('./index')

module.exports = async () => {
  try {
    const result = await db.query('SELECT * FROM users')
    if (result.rows.length === 0) {
      // Can't manually insert rows with id column without manually updating the user_id_seq value or else the serial function fucks up
      // See: https://stackoverflow.com/questions/9108833/postgres-autoincrement-not-updated-on-explicit-id-inserts
      await db.query(`INSERT INTO users (username, email, password_hash, invite_key, display_name, bio) VALUES
        ('stel', 'stel@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key1', 'Stel Abrego', 'I''m here and I''m queer'),
        ('alice', 'alice@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key2', 'sexyalice666', 'I like movies'),
        ('ash', 'ash@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key3', 'ashthisblunt', 'smoke')
      `)
      await db.query(`INSERT INTO events (user_id, url_key, name, location, lat, lon, description, date_start, date_end) VALUES
        (1, 'test', 'stels big party', '306 N Adams St Ypsilanti', 42.245083, -83.615924, 'We''re really just gonna smoke weed and compliment eachother', '2019-10-31 18:00', '2019-10-31 23:00'),
        (2, 'test2', 'alices christmas party', DEFAULT, NULL, NULL, 'Bring your best ugly sweaters', '2019-12-25T08:00:00-5', '2019-12-25T20:00:00-5')
      `)
      return true
    }
  } catch (err) {
    console.error(err.stack)
  }
  return false
}

const db = require('./index')

module.exports = async () => {
  try {
    // Can't manually insert rows with id column without manually updating the user_id_seq value or else the serial function fucks up
    // See: https://stackoverflow.com/questions/9108833/postgres-autoincrement-not-updated-on-explicit-id-inserts
    // don't forget to escaple apostraphes with by adding two ''
    console.log('Attempting test data entry')
    await db.query(`INSERT INTO users (username, email, password_hash, invite_key, display_name, bio) VALUES
        ('stel', 'stel@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key1', 'stel', 'I''m here and I''m queer'),
        ('sexyalice666', 'alice@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key2', 'alice', 'I like movies'),
        ('ashthisblunt', 'ash@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key3', 'ash', 'smoke'),
        ('carta123', 'carta@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key4', 'carta', 'i make comics'),
        ('pikachu_addiction', 'ej@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key5', 'EJ', 'gym life'),
        ('comic_luver', 'casey@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key6', 'casey', 'i''m probably at michigan adventures'),
        ('mutual_aid', 'vidhya@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key7', 'vidhya', 'liberation is cool i guess'),
        ('doubletrans', 'renee@gmail.com', crypt('123456', gen_salt('md5')), 'invite_key8', 'renée', 'it''s time for tea')
      `)
    await db.query(`INSERT INTO events (user_id, url_key, name, location, lat, lon, description, date_start, date_end) VALUES
        (1, 'test', 'stels big party', '306 N Adams St Ypsilanti', 42.245083, -83.615924, 'We''re really just gonna smoke weed and compliment eachother', '2019-10-31 18:00', '2019-10-31 23:00'),
        (2, 'test2', 'alices christmas party', DEFAULT, NULL, NULL, 'Bring your best ugly sweaters', '2019-12-25T08:00:00-5', '2019-12-25T20:00:00-5')
      `)
    return Promise.resolve()
  } catch (err) {
    console.error(err.stack)
    return Promise.reject(err)
  }
}

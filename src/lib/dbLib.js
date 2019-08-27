const sqlite = require('sqlite')
const path = require('path')
const crypto = require('crypto')
const sql = require('sqlstring')
const fs = require('fs').promises
// sqlstring is WAY better then sqlite3 or sql-template-strings because it accepts an object param
// with properties that don't need to be referenced in the sql string. this way, you don't have to write
// out all the column names at all. So much simpler! Updates don't have to be multiple statements now.

const dbLib = {
  // async functions implicitly return a Promise
  insertSql: item => {
    const columns = Object.keys(item).sort().map(column => sql.escapeId(column)).join(', ')
    const values = Object.keys(item).sort().map(column => sql.escape(item[column])).join(', ')
    return [columns, values]
  },
  dbPromise: async () => {
    const db = await sqlite.open(dbLib.dbPath, { promise: Promise, verbose: true })
    await db.run('PRAGMA foreign_keys = ON')
    return db
  },
  dbPath: path.resolve(__dirname, '../../build/eventz.db'),
  dbSetupPath: path.resolve(__dirname, '../../create_database.sql'),
  dbRefresh: async (errHandler) => {
    try {
      const sqlFile = await fs.readFile(dbLib.dbSetupPath, 'utf8')
      const uncommentedSql = sqlFile.split('\n').filter(line => !line.includes('--')).join('')
      const db = await dbLib.dbPromise()
      return db.exec(uncommentedSql)
    } catch (err) {
      errHandler(err)
    }
  },
  dbPopulate: async (errHandler) => {
    try {
      await dbLib.dbRefresh(errHandler)
      await dbLib.insertUser({ id: 1, username: 'stel', email: 'stel@gmail.com', password: 'akbhfsuhd' }, errHandler)
      await dbLib.insertUser({ id: 2, username: 'alice', email: 'alice@gmail.com', password: 'h7d5kf4s' }, errHandler)
      await dbLib.insertUser({ id: 3, username: 'ash', email: 'ash@gmail.com', password: 'shjkshkh3' }, errHandler)
      await dbLib.insertEvent({ id: 1, userId: 1, name: 'stels big party' }, errHandler)
      await dbLib.insertUserRelationship({ id: 1, initialUserId: 1, targetUserId: 2, relationship: 'listen' })
    } catch (err) {
      errHandler(err)
    }
  },
  insertUser: async (user, errHandler) => {
    let db
    try {
      user.inviteKey = crypto.randomBytes(6).toString('hex')
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(user)
      const statement = `INSERT INTO user ( ${columns} ) VALUES ( ${values} )`
      const results = await db.run(statement)
      await dbLib.insertUserPrivacy({ userId: results.lastID }, errHandler)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertUserPrivacy: async (userPrivacy, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(userPrivacy)
      const statement = `INSERT INTO userPrivacy ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertUserRelationship: async (userRelationship, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(userRelationship)
      const statement = `INSERT INTO userRelationship ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertEvent: async (event, errHandler) => {
    let db
    try {
      event.urlKey = crypto.randomBytes(6).toString('hex')
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(event)
      const statement = `INSERT INTO event ( ${columns} ) VALUES ( ${values} )`
      const results = await db.run(statement)
      await dbLib.insertEventPrivacy({ eventId: results.lastID }, errHandler)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertEventPrivacy: async (eventPrivacy, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(eventPrivacy)
      const statement = `INSERT INTO eventPrivacy ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertEventImage: async (eventImage, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(eventImage)
      const statement = `INSERT INTO eventImage ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertAttendance: async (attendance, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(attendance)
      const statement = `INSERT INTO attendance ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertEventQuestion: async (eventQuestion, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(eventQuestion)
      const statement = `INSERT INTO eventQuestion ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  insertEventTag: async (eventTag, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(eventTag)
      const statement = `INSERT INTO eventTag ( ${columns} ) VALUES ( ${values} )`
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteUserPrivacy: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM userPrivacy WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventPrivacy: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventPrivacy WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteUserRelationship: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM userRelationship WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventImage: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventImage WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteAttendance: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM attendance WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventQuestion: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventQuestion WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventTag: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventTag WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteUser: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      let statement = sql.format('SELECT id FROM userRelationship WHERE targetUserId = ? OR initialUserId = ?', [id, id])
      let results = await db.all(statement)
      let updates = results.map(row => dbLib.deleteUserRelationship(row.id, errHandler))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM userPrivacy WHERE userId = ?', id)
      results = await db.get(statement)
      await dbLib.deleteUserPrivacy(results.id, errHandler)
      statement = sql.format('SELECT id FROM event WHERE userId = ?', id)
      results = await db.all(statement)
      updates = results.map(row => dbLib.deleteEvent(row.id, errHandler))
      await Promise.all(updates)
      statement = sql.format('DELETE FROM user WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEvent: async (id, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      let statement = sql.format('SELECT id FROM attendance WHERE eventId = ?', id)
      let results = await db.all(statement)
      let updates = results.map(row => dbLib.deleteAttendance(row.id, errHandler))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM eventImage WHERE eventId = ?', id)
      results = await db.all(statement)
      updates = results.map(row => dbLib.deleteEventImage(row.id, errHandler))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM eventTag WHERE eventId = ?', id)
      results = await db.all(statement)
      updates = results.map(row => dbLib.deleteEventTag(row.id, errHandler))
      await Promise.all(updates)
      statement = sql.format('SELECT id FROM eventPrivacy WHERE eventId = ?', id)
      results = await db.get(statement)
      await dbLib.deleteEventPrivacy(results.id, errHandler)
      statement = sql.format('DELETE FROM event WHERE id = ?', id)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },

  updateUser: async (user, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const userId = user.id
      delete user.id
      const statement = sql.format('UPDATE user SET ? WHERE id = ?', [user, userId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateEvent: async (event, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const eventId = event.id
      delete event.id
      const statement = sql.format('UPDATE event SET ? WHERE id = ?', [event, eventId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateEventPrivacy: async (eventPrivacy, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const eventPrivacyId = eventPrivacy.id
      delete eventPrivacy.id
      const statement = sql.format('UPDATE eventPrivacy SET ? WHERE id = ?', [eventPrivacy, eventPrivacyId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateUserPrivacy: async (userPrivacy, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const userPrivacyId = userPrivacy.id
      delete userPrivacy.id
      const statement = sql.format('UPDATE userPrivacy SET ? WHERE id = ?', [userPrivacy, userPrivacyId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateUserRelationship: async (userRelationship, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const userRelationshipId = userRelationship.id
      delete userRelationship.id
      const statement = sql.format('UPDATE userRelationship SET ? WHERE id = ?', [userRelationship, userRelationshipId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateEventImage: async (eventImage, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const eventImageId = eventImage.id
      delete eventImage.id
      const statement = sql.format('UPDATE eventImage SET ? WHERE id = ?', [eventImage, eventImageId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateAttendance: async (attendance, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const attendanceId = attendance.id
      delete attendance.id
      const statement = sql.format('UPDATE attendance SET ? WHERE id = ?', [attendance, attendanceId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateEventQuestion: async (eventQuestion, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const eventQuestionId = eventQuestion.id
      delete eventQuestion.id
      const statement = sql.format('UPDATE eventQuestion SET ? WHERE id = ?', [eventQuestion, eventQuestionId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  updateEventTag: async (eventTag, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const eventTagId = eventTag.id
      delete eventTag.id
      const statement = sql.format('UPDATE eventTag SET ? WHERE id = ?', [eventTag, eventTagId])
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  }
}

module.exports = dbLib

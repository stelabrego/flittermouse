const sqlite = require('sqlite')
const path = require('path')
const crypto = require('crypto')
const sql = require('sqlstring')

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
  insertEventPicture: async (eventPicture, errHandler) => {
    let db
    try {
      db = await dbLib.dbPromise()
      const [columns, values] = dbLib.insertSql(eventPicture)
      const statement = `INSERT INTO eventPicture ( ${columns} ) VALUES ( ${values} )`
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
  deleteUserPrivacy: async (userPrivacy, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM userPrivacy WHERE ?', userPrivacy)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventPrivacy: async (eventPrivacy, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventPrivacy WHERE ?', eventPrivacy)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteUserRelationships: async (userRelationship, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM userRelationship WHERE ?', userRelationship)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventPictures: async (eventPicture, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventPicture WHERE ?', eventPicture)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteAttendances: async (attendance, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM attendance WHERE ?', attendance)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventQuestions: async (eventQuestion, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventQuestion WHERE ?', eventQuestion)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEventTags: async (eventTag, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      const statement = sql.format('DELETE FROM eventTag WHERE ?', eventTag)
      await db.run(statement)
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteUsers: async (user, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      await db.all('SELECT id FROM user WHERE ?', user)
        .map(row => row.id)
        .forEach(async userId => {
          dbLib.deleteAttendance({ userId }, errHandler)
          dbLib.deleteUserPrivacy({ userId }, errHandler)
          dbLib.deleteUserRelationships({ initialUserId: userId }, errHandler)
          dbLib.deleteUserRelationships({ targetUserId: userId }, errHandler)
          dbLib.deleteEvent({ userId }, errHandler)
          const statement = sql.format('DELETE FROM user WHERE id = ?', userId)
          await db.run(statement)
        })
    } catch (err) {
      errHandler(err)
    } finally {
      if (db) db.close()
    }
  },
  deleteEvents: async (event, errHandler) => {
    // only one field accepted
    let db
    try {
      db = await dbLib.dbPromise()
      await db.all('SELECT id FROM event WHERE ?', event)
        .map(row => row.id)
        .forEach(async eventId => {
          dbLib.deleteAttendance({ eventId }, errHandler)
          dbLib.deleteEventPictures({ eventId }, errHandler)
          dbLib.deleteEventPrivacy({ eventId }, errHandler)
          dbLib.deleteEventTag({ eventId }, errHandler)
          const statement = sql.format('DELETE FROM event WHERE id = ?', eventId)
          await db.run(statement)
        })
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
  updateEventPicture: async (eventPicture, errHandler) => {
    // must have id
    let db
    try {
      db = await dbLib.dbPromise()
      const eventPictureId = eventPicture.id
      delete eventPicture.id
      const statement = sql.format('UPDATE eventPicture SET ? WHERE id = ?', [eventPicture, eventPictureId])
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

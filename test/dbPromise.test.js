const dbPromise = require('../src/lib/dbPromise')

describe('dbPromise', () => {
  beforeEach(async () => {
    const db = await dbPromise(err => { throw err })
    await db.refresh()
    await db.populate()
    await db.close()
  })
  describe('insertUser', () => {
    it('should accept good users', () => {
      const good = [
        { username: 'pooppoop', email: 'email@poop.com', password: 'ajhdjfhuhfc', inviteKey: 'hkjshe3' }
      ]
      const tests = good.map(user => dbPromise(err => { throw err }).then(db => db.insertUser(user)))
      return Promise.all(tests)
    })
  })
  describe('insertEvent', () => {
    it('should accept good users', () => {
      const good = [
        { userId: 1, name: 'Big Party' }
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.insertEvent(item)))
      return Promise.all(tests)
    })
  })
  describe('insertUserRelationship', () => {
    it('should accept good relationships', () => {
      const good = [
        { initialUserId: 2, targetUserId: 3, relationship: 'listen' }
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.insertUserRelationship(item)))
      return Promise.all(tests)
    })
  })
  describe('insertEventImage', () => {
    it('should accept good images', () => {
      const good = [
        { eventId: 1, url: 'google.com/photo.jpeg', order: 0 }
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.insertEventImage(item)))
      return Promise.all(tests)
    })
  })
  describe('insertEventAttendance', () => {
    it('should accept good attendance', () => {
      const good = [
        { eventId: 1, userId: 1 }
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.insertAttendance(item)))
      return Promise.all(tests)
    })
  })
  describe('insertEventQuestion', () => {
    it('should accept good question', () => {
      const good = [
        { eventId: 1, userId: 2, question: 'Will there be snacks?' }
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.insertEventQuestion(item)))
      return Promise.all(tests)
    })
  })
  describe('insertEventTag', () => {
    it('should accept good tag', () => {
      const good = [
        { eventId: 1, tagName: 'party' }
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.insertEventTag(item)))
      return Promise.all(tests)
    })
  })
  describe('deleteUserRelationship', () => {
    it('should accept good request', () => {
      const good = [
        1
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.deleteUserRelationship(item)))
      return Promise.all(tests)
    })
  })
  describe('deleteEventImage', () => {
    it('should accept good request')
  })
  describe('deleteAttendance', () => {
    it('should accept good request')
  })
  describe('deleteEventQuestion', () => {
    it('should accept good request')
  })
  describe('deleteEventTag', () => {
    it('should accept good request')
  })
  describe('deleteUser', () => {
    it('should accept good request', () => {
      const good = [
        1
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.deleteUser(item)))
      return Promise.all(tests)
    })
  })
  describe('deleteEvent', () => {
    it('should accept good request', () => {
      const good = [
        1
      ]
      const tests = good.map(item => dbPromise(err => { throw err }).then(db => db.deleteEvent(item)))
      return Promise.all(tests)
    })
  })
  describe('updateEventImages', () => {
    it('should accept good request')
  })
  describe('updateAttendances', () => {
    it('should accept good request')
  })
  describe('updateEventQuestions', () => {
    it('should accept good request')
  })
  describe('updateEventTags', () => {
    it('should accept good request')
  })
  describe('updateUsers', () => {
    it('should accept good request')
  })
  describe('updateEvents', () => {
    it('should accept good request')
  })
})

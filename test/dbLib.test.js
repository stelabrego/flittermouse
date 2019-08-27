const assert = require('assert')
const dbLib = require('../src/lib/dbLib')

describe('dbLib', () => {
  beforeEach(async () => dbLib.dbPopulate(err => { throw err }))
  describe('insertUser', () => {
    it('should accept good users', () => {
      const good = [
        { username: 'pooppoop', email: 'email@poop.com', password: 'ajhdjfhuhfc', inviteKey: 'hkjshe3' }
      ]
      const tests = good.map(user => dbLib.insertUser(user, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('insertEvent', () => {
    it('should accept good users', () => {
      const good = [
        { userId: 1, name: 'Big Party' }
      ]
      const tests = good.map(item => dbLib.insertEvent(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('insertUserRelationship', () => {
    it('should accept good relationships', () => {
      const good = [
        { initialUserId: 2, targetUserId: 3, relationship: 'listen' }
      ]
      const tests = good.map(item => dbLib.insertUserRelationship(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('insertEventImage', () => {
    it('should accept good images', () => {
      const good = [
        { eventId: 1, url: 'google.com/photo.jpeg', order: 0 }
      ]
      const tests = good.map(item => dbLib.insertEventImage(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('insertEventAttendance', () => {
    it('should accept good attendance', () => {
      const good = [
        { eventId: 1, userId: 1 }
      ]
      const tests = good.map(item => dbLib.insertAttendance(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('insertEventQuestion', () => {
    it('should accept good question', () => {
      const good = [
        { eventId: 1, userId: 2, question: 'Will there be snacks?' }
      ]
      const tests = good.map(item => dbLib.insertEventQuestion(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('insertEventTag', () => {
    it('should accept good tag', () => {
      const good = [
        { eventId: 1, tagName: 'party' }
      ]
      const tests = good.map(item => dbLib.insertEventTag(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('deleteUserRelationships', () => {
    it('should accept good request', () => {
      const good = [
        { id: 1 }
      ]
      const tests = good.map(item => dbLib.deleteUserRelationships(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('deleteEventImages', () => {
    it('should accept good request')
  })
  describe('deleteAttendances', () => {
    it('should accept good request')
  })
  describe('deleteEventQuestions', () => {
    it('should accept good request')
  })
  describe('deleteEventTags', () => {
    it('should accept good request')
  })
  describe('deleteUsers', () => {
    it('should accept good request')
  })
  describe('deleteEvents', () => {
    it('should accept good request')
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

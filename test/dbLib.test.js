const assert = require('assert')
const dbLib = require('../src/lib/dbLib')

describe('dbLib', () => {
  describe('addUser', () => {
    it('should accept good users', () => {
      const good = [
        { username: 'pooppoop', email: 'email@poop.com', password: 'ajhdjfhuhfc', inviteKey: 'hkjshe3' }
      ]
      const tests = good.map(user => dbLib.insertUser(user, err => { throw err }))
      return Promise.all(tests)
    })
  })
  describe('addEvent', () => {
    it('should accept good users', () => {
      const good = [
        { userId: 1, name: 'Big Party' }
      ]
      const tests = good.map(item => dbLib.insertEvent(item, err => { throw err }))
      return Promise.all(tests)
    })
  })
})

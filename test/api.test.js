const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const exec = require('child_process').exec
const crypto = require('crypto')

let goodUsers = [
  { username: 'lovenoone', password: 'hibob', email: 'emogoth@gmail.com' },
  { username: 'anlasifs', password: 'password', email: 'haonicnen@gmail.com' }
]
const badUsers = [
  {},
  { username: 'hithere', email: 'generic@gmail.com' }
]
const goodEvents = [
  { name: 'stel bday party 2' }
]
const badEvents = [
  {},
  { name: 'christmas partayy', christmas: true }
]

describe('database api', () => {
  before((done) => {
    exec('make db', (err, stdout, stderr) => {
      if (err) done(err)
      done()
    })
  })
  describe('POST /users/add', () => {
    it('should reject new users with incorrect schema', () => {
      const tests =
        badUsers.map((user) => {
          return request(app)
            .post('/users/add')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(!res.body.success, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
    it('should accept new users with correct schema', () => {
      // add userKey to user object
      const goodUsersWithKeys = []
      const tests =
        goodUsers.map((user, index) => {
          return request(app)
            .post('/users/add')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              const userKey = res.body.userKey
              assert(res.body.success, JSON.stringify(res.body))
              assert(res.body.userKey, JSON.stringify(res.body))
              goodUsersWithKeys.push({ ...user, userKey })
            })
            .catch((err) => {
              throw err
            })
        })
      goodUsers = goodUsersWithKeys
      return Promise.all(tests)
    })
  })

  describe('PUT users/update', () => {
    it('should reject requests without userKey', () => {
      const tests =
        goodUsers.map((user) => {
          return request(app)
            .put('/users/update')
            .send({ username: user.username, password: user.password })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(!res.body.success, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
    it('should reject requests with more than one valid fields to change', () => {
      const tests =
        goodUsers.map((user) => {
          return request(app)
            .put('/users/update')
            .send({ userKey: user.userKey, username: user.username, password: user.password })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(!res.body.success, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
    it('should accept updates with correct schema', () => {
      goodUsers.map((user) => {
        user.username = crypto.randomBytes(6).toString('hex')
        user.email = crypto.randomBytes(6).toString('hex')
        user.password = crypto.randomBytes(6).toString('hex')
        return user
      })
      const tests =
        goodUsers.map((user) => {
          return request(app)
            .put('/users/update')
            .send({ userKey: user.userKey, username: user.username })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(res.body.success, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
          .concat(
            goodUsers.map((user) => {
              return request(app)
                .put('/users/update')
                .send({ userKey: user.userKey, password: user.password })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                  assert(res.body.success, JSON.stringify(res.body))
                })
                .catch((err) => {
                  throw err
                })
            })
          )
          .concat(
            goodUsers.map((user) => {
              return request(app)
                .put('/users/update')
                .send({ userKey: user.userKey, email: user.email })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .then((res) => {
                  assert(res.body.success, JSON.stringify(res.body))
                })
                .catch((err) => {
                  throw err
                })
            })
          )
      return Promise.all(tests)
    })
    it('should accept updates with no material changes', () => {
      const tests =
        goodUsers.map((user) => {
          return request(app)
            .put('/users/update')
            .send({ userKey: user.userKey, username: user.username })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(res.body.success, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })
})

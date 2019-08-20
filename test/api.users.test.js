const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const exec = require('child_process').exec
const crypto = require('crypto')

const goodAddRequests = [
  { username: 'lovenoone', password: 'hibob', email: 'emogoth@gmail.com' },
  { username: 'anlasifs', password: 'password', email: 'haonicnen@gmail.com' }
]

const goodAddRequestsWithKeys = []

const badAddRequests = [
  {},
  { username: 'hithere', email: 'generic@gmail.com' }
]
const badDeleteRequests = [
  {},
  { userKey: 'doesNotExist' }
]

const badPrivacyUpdateRequests = [
  {},
  { userKey: 'doesNotExist' },
  { userKey: 'doesNotExist', subscribedEventsVisibility: 'trusted' }
]

describe('/users endpoints', () => {
  before((done) => {
    exec('make db', (err, stdout, stderr) => {
      if (err) done(err)
      done()
    })
  })
  describe('POST /users/add', () => {
    it('should reject bad requests', () => {
      const tests =
        badAddRequests.map((reqBody) => {
          return request(app)
            .post('/users/add')
            .send(reqBody)
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
    it('should accept good requests', () => {
      // add userKey to user object
      const tests =
        goodAddRequests.map((reqBody) => {
          return request(app)
            .post('/users/add')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              const userKey = res.body.userKey
              assert(res.body.success, JSON.stringify(res.body))
              assert(res.body.userKey, JSON.stringify(res.body))
              goodAddRequestsWithKeys.push({ ...reqBody, userKey })
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('PUT users/update', () => {
    it('should reject bad requests without userKey', () => {
      const tests =
        goodAddRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send({ username: reqBody.username, password: reqBody.password })
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
    it('should reject bad requests with more than one field to change', () => {
      const tests =
        goodAddRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send({ userKey: reqBody.userKey, username: reqBody.username, password: reqBody.password })
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
    it('should accept good requests', () => {
      // change the data for the users we have already entered in previous tests
      // so we can attempt to update the database with the new data user their userKey
      goodAddRequestsWithKeys.map((reqBody) => {
        reqBody.username = crypto.randomBytes(6).toString('hex')
        reqBody.email = crypto.randomBytes(6).toString('hex')
        reqBody.password = crypto.randomBytes(6).toString('hex')
        return reqBody
      })
      const tests =
        goodAddRequestsWithKeys.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send({ userKey: reqBody.userKey, username: reqBody.username })
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
            goodAddRequestsWithKeys.map((reqBody) => {
              return request(app)
                .put('/users/update')
                .send({ userKey: reqBody.userKey, password: reqBody.password })
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
            goodAddRequestsWithKeys.map((reqBody) => {
              return request(app)
                .put('/users/update')
                .send({ userKey: reqBody.userKey, email: reqBody.email })
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
    it('should accept good requests with no material changes', () => {
      const tests =
        goodAddRequestsWithKeys.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send({ userKey: reqBody.userKey, username: reqBody.username })
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

  describe('PUT /users/privacy', () => {
    it('should reject bad requests', () => {
      const tests =
        badPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/privacy/update')
            .send(reqBody)
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
    it('should accept good requests', () => {
      const tests =
        goodAddRequestsWithKeys.map((reqBody) => {
          return request(app)
            .put('/users/privacy/update')
            .send({ userKey: reqBody.userKey, subscribedEventsVisibility: 'trusted' })
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

  describe('DELETE /users/delete', () => {
    it('should reject bad requests', () => {
      const tests =
        badDeleteRequests.map((reqBody) => {
          return request(app)
            .delete('/users/delete')
            .send(reqBody)
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
    it('should accept good requests', () => {
      const tests =
        goodAddRequestsWithKeys.map((reqBody) => {
          return request(app)
            .delete('/users/delete')
            .send({ userKey: reqBody.userKey })
            .set('Accept', 'application/json')
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

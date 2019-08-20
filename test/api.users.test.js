const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const exec = require('child_process').exec

describe('/users endpoints', () => {
  before((done) => {
    exec('make db', (err, stdout, stderr) => {
      if (err) done(err)
      done()
    })
  })
  describe('POST /users/add', () => {
    it('should reject bad requests', () => {
      const badAddRequests = [
        {},
        { username: 'hithere', email: 'generic@gmail.com' }
      ]
      const tests =
        badAddRequests.map((reqBody) => {
          return request(app)
            .post('/users/add')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
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
      const goodAddRequests = [
        { username: 'lovenoone', password: 'hibob', email: 'emogoth@gmail.com' },
        { username: 'anlasifs', password: 'password', email: 'haonicnen@gmail.com' }
      ]
      const tests =
        goodAddRequests.map((reqBody) => {
          return request(app)
            .post('/users/add')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
              assert(res.body.success, JSON.stringify(res.body))
              assert(res.body.userKey, JSON.stringify(res.body))
            })
            .catch((err) => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('PUT users/update', () => {
    it('should reject bad requests', () => {
      const badUpdateRequests = [
        {},
        { username: 'hihihihihihi' },
        { userKey: 'invalidUserKey', username: 'bigboi315' }
      ]
      const tests =
        badUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
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
      const goodUpdateRequests = [
        { userKey: 'validUserKey', username: 'CardiB' },
        { userKey: 'validUserKey2', bio: 'I am also Cardi B' }
      ]
      const tests =
        goodUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send(reqBody)
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
    it('should accept good requests with no material changes', () => {
      const goodUpdateRequests = [
        { userKey: 'validUserKey', username: 'CardiB' },
        { userKey: 'validUserKey2', bio: 'I am also Cardi B' }
      ]
      const tests =
        goodUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send(reqBody)
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
      const badPrivacyUpdateRequests = [
        {},
        { userKey: 'doesNotExist' },
        { userKey: 'doesNotExist', subscribedEventsVisibility: 'trusted' }
      ]
      const tests =
        badPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/privacy/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
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
      const goodPrivacyUpdateRequests = [
        { userKey: 'validUserKey', subscribedEventsVisibility: 'trusted' }
      ]
      const tests =
        goodPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/privacy/update')
            .send(reqBody)
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
      const badDeleteRequests = [
        {},
        { userKey: 'doesNotExist' }
      ]
      const tests =
        badDeleteRequests.map((reqBody) => {
          return request(app)
            .delete('/users/delete')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
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
      const goodDeleteRequests = [
        { userKey: 'validUserKey2' }
      ]
      const tests =
        goodDeleteRequests.map((reqBody) => {
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

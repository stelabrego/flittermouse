const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')

describe('/users endpoints', () => {
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

  describe('PUT users/update', () => {
    it('should reject bad requests', () => {
      const badUpdateRequests = [
        {},
        { username: 'hihihihihihi' },
        { id: 10000, username: 'bigboi315' }
      ]
      const tests =
        badUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        { id: 1, username: 'CardiB' },
        { id: 2, bio: 'I am also Cardi B' },
        { id: 3, username: 'playboi carti', bio: 'hi there' }
      ]
      const tests =
        goodUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        { id: 1, username: 'CardiB' },
        { id: 2, bio: 'I am also Cardi B' }
      ]
      const tests =
        goodUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        { userId: 10000 },
        { userId: 20000, subscribedEventsVisibility: 'listeners' }
      ]
      const tests =
        badPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/privacy/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        { userId: 1, subscribedEventsVisibility: 'listeners' }
      ]
      const tests =
        goodPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/users/privacy/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        { id: 10000 }
      ]
      const tests =
        badDeleteRequests.map((reqBody) => {
          return request(app)
            .delete('/users/delete')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
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
        { id: 1 }
      ]
      const tests =
        goodDeleteRequests.map((reqBody) => {
          return request(app)
            .delete('/users/delete')
            .send(reqBody)
            .set('Accept', 'application/json')
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

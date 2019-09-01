const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const dbPromise = require('../src/lib/dbPromise')

describe('/users endpoints', () => {
  beforeEach(async () => {
    const db = await dbPromise()
    await db.refresh()
    await db.populate()
    await db.close()
  })
  describe('POST /users/add', () => {
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
  })

  describe('PUT /users/privacy', () => {
    it('should accept good requests', () => {
      const goodPrivacyUpdateRequests = [
        { userId: 1, attendingVisibility: 'listeners' }
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

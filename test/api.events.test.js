const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const dbPromise = require('../src/lib/dbPromise')

describe('/events endpoints', () => {
  beforeEach(async () => {
    const db = await dbPromise()
    await db.refresh()
    await db.populate()
    await db.close()
  })
  describe('POST events/add', () => {
    it('should accept good requests', () => {
      const goodAddRequests = [
        { name: 'Stels Big Birthday Bash', user_id: 1 }
      ]
      const tests =
        goodAddRequests.map((reqBody) => {
          return request(app)
            .post('/events/add')
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

  describe('DELETE events/delete', () => {
    it('should accept good requests', () => {
      const goodDeleteRequests = [
        { id: 1 }
      ]
      const tests =
        goodDeleteRequests.map((reqBody) => {
          return request(app)
            .delete('/events/delete')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then((res) => { assert(res.body.success, JSON.stringify(res.body)) })
            .catch(err => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('PUT events/update', () => {
    it('should accept good requests', () => {
      const goodUpdateRequests = [
        { id: 1, name: 'Updated name event', date_start: '248792874' },
        { id: 1, date_start: '44244525' }
      ]
      const tests =
        goodUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/events/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then((res) => { assert(res.body.success, JSON.stringify(res.body)) })
            .catch(err => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })

  describe('PUT events/privacy/update', () => {
    it('should accept good requests', () => {
      const goodPrivacyUpdateRequests = [
        { id: 1, visibility: 'private' },
        { id: 1, visibility: 'mutuals' }
      ]
      const tests =
        goodPrivacyUpdateRequests.map((reqBody) => {
          return request(app)
            .put('/events/privacy/update')
            .send(reqBody)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .then((res) => { assert(res.body.success, JSON.stringify(res.body)) })
            .catch(err => {
              throw err
            })
        })
      return Promise.all(tests)
    })
  })
})

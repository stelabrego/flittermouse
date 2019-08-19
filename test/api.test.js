const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const exec = require('child_process').exec

const goodUsers = [
  { username: 'lovenoone', password: 'hibob', email: 'emogoth@gmail.com' },
  { username: 'anlasifs', password: 'password', email: 'haonicnen@gmail.com' }
]
const badUsers = [
  { username: 'hithere', email: 'generic@gmail.com' }
]
const goodEvents = [
  { name: 'stel bday party 2' }
]
const badEvents = [
  { name: 'christmas partayy', christmas: true }
]

describe('database api', () => {
  describe('/users/add', () => {
    beforeEach((done) => {
      exec('make db', (err, stdout, stderr) => {
        if (err) throw done(err)
        done()
      })
    })
    it('should not accept empty request', () => {
      request(app)
        .post('/users/add')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          assert(res.body.success === false, JSON.stringify(res.body))
        })
        .expect(200)
    })
    it('should accept new users with correct schema', () => {
      goodUsers.forEach((user) => {
        request(app)
          .post('/users/add')
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect((res) => {
            assert(res.body.success === true, JSON.stringify(res.body))
          })
          .expect(200)
      })
    })
    it('should reject new users with incorrect schema', () => {
      badUsers.forEach((user) => {
        request(app)
          .post('/users/add')
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect((res) => {
            assert(res.body.success === true, JSON.stringify(res.body))
          })
          .expect(200)
      })
    })
  })

  describe('/events/add', () => {
    beforeEach((done) => {
      exec('make db', (err, stdout, stderr) => {
        if (err) throw done(err)
        done()
      })
    })
    it('should not accept empty request', () => {
      request(app)
        .post('/events/add')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
          assert(res.body.success === false, JSON.stringify(res.body))
        })
        .expect(200)
    })
    it('should accept new events with correct schema', () => {
      goodEvents.forEach((event) => {
        request(app)
          .post('/events/add')
          .send(event)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect((res) => {
            assert(res.body.success === true, JSON.stringify(res.body))
          })
          .expect(200)
      })
    })
    it('should reject new events with incorrect schema', () => {
      badEvents.forEach((val) => {
        request(app)
          .post('/events/add')
          .send(val)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect((res) => {
            assert(res.body.success === true, JSON.stringify(res.body))
          })
          .expect(200)
      })
    })
  })
})

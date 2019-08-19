const assert = require('assert')
const request = require('supertest')
const app = require('../src/app')
const exec = require('child_process').exec

const goodUsers = [
  { username: 'lovenoone', password: 'hibob', email: 'emogoth@gmail.com' },
  { username: 'anlasifs', password: 'password', email: 'haonicnen@gmail.com' }
]

const goodEvents = [
  { name: 'stel bday party 2' }
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
      goodUsers.forEach((val) => {
        request(app)
          .post('/users/add')
          .send({ username: 'alkjslsfi', password: 'skjdhfkjd', email: 'lsfdjsskhsh' })
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

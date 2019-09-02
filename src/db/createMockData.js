// sqlstring is WAY better then sqlite3 or sql-template-strings because it accepts an object param
// with properties that don't need to be referenced in the sql string. this way, you don't have to write
// out all the column names at all. So much simpler! Updates don't have to be multiple statements now.
// FUCK SQL STRING IT DOESN'T EVEN ESCAPE SINGLE QUOTATION MARKS RIGHT '' GODDDDD

// await this.insertUser({ id: 1, username: 'stel', email: 'stel@gmail.com', password: '1', displayName: 'Stel Abrego', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed efficitur, nisi sed venenatis hendrerit, erat justo condimentum arcu, id semper tellus erat vel magna.' })
// await this.insertUser({ id: 2, username: 'alice', email: 'alice@gmail.com', password: '1' })
// await this.insertUser({ id: 3, username: 'ash', email: 'ash@gmail.com', password: '1' })
// await this.insertEvent({ id: 1, urlKey: 'test', userId: 1, name: 'stels big party', address: '306 N Adams St Ypsilanti', lat: 42.245083, lon: -83.615924, description: 'Were really just gonna smoke weed and compliment eachother', dateStart: '2019-10-31 18:00', dateEnd: '2019-10-31 23:00' })
// await this.insertEvent({ id: 2, urlKey: 'test2', userId: 2, name: 'alices christmas party', description: 'Bring your best ugly sweaters', dateStart: '2019-12-25 08:00', dateEnd: '2019-12-25 20:00' })
// await this.insertUserRelationship({ initialUserId: 1, targetUserId: 2, relationship: 'listen' })
// await this.insertAttendance({ userId: 1, eventId: 2 })
// await this.insertEventTag({ eventId: 1, name: 'party' })
// await this.insertEventTag({ eventId: 1, name: 'christmas' })
// await this.insertEventTag({ eventId: 2, name: 'party' })
// await this.insertEventTag({ eventId: 2, name: 'BYOB' })
// await this.insertEventQuestion({ eventId: 1, userId: 2, question: 'Can I bring Lucha?', answer: 'Yes, Indi would love that', visible: 1 })

// user.inviteKey = crypto.randomBytes(3).toString('hex')

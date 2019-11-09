let chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const url = `http://localhost:8000`;
const request = require('supertest')(url);

describe('Booking - Mutation', () => {
    before(`login - Obtain JWT token`, done => {
        request
            .post('/graphql')
            .send({
                query: '{ login(email: "user1", password: "test") { token } }',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                jwtToken = res.body.data.login.token;
                done();
            });
    });

    it('bookEvent - Logged in user can book event', done => {
        request
            .post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                query: `mutation { bookEvent(eventId:"5d89c9639899a819f8d3104e") { id eventId {title} userId {email}} }`,
            }) // This eventId's title is "Party"
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.bookEvent;
                expect(queryResult.eventId.title).to.equal('Party');
                expect(queryResult.userId.email).to.equal('user1');
                newBookingId = queryResult.id;
                // Query data using ORM to check if booking is made
                done();
            });
    });

    it('cancelBooking - Logged in user can cancel their own booking', done => {
        request
            .post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                query: `mutation { cancelBooking(id:"${newBookingId}") { id } }`,
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Query data using ORM to check if booking is canceled
                done();
            });
    });
});

describe('Booking - Query', () => {
    before(`login - Obtain JWT token`, done => {
        request
            .post('/graphql')
            .send({
                query:
                    '{ login(email: "user1@test.com", password: "test") { token } }',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                jwtToken = res.body.data.login.token;
                done();
            });
    });

    it('booking - Logged in user can query a booking', done => {
        request
            .post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                query:
                    '{ booking(id:"5d959324e7140e41ecd909df") { eventId { title } userId { email } } }',
            }) // This eventId's title is "Party"
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.booking;
                queryResult.eventId.title.should.equal('Party');
                queryResult.userId.email.should.equal('user1@test.com');
                done();
            });
    });

    it('bookings - Logged in user can query all bookings', done => {
        request
            .post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                query: '{ bookings { eventId { title } userId { email } } }',
            }) // This eventId's title is "Party"
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                resultArray = res.body.data.bookings;

                for (let i = 0; i < resultArray.length; i++) {
                    resultArray[i].should.have.property('eventId');
                    resultArray[i].should.have.property('userId');
                }
                done();
            });
    });
});

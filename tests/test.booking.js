let chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const url = `http://localhost:4000`;
const request = require('supertest')(url);


describe('GraphQL mutation - Booking', () => {

    before(`login - Obtain JWT token`, (done) => {
        request.post('/graphql')
            .send({ query: '{ login(email: "creator1", password: "test") { token } }' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                jwtToken = res.body.data.login.token;
                done();
            });
        });

    it('bookEvent - Logged in user can book event', (done) => {
        request.post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            // .send({ query: 'mutation { bookEvent(eventId:"5d89c9639899a819f8d3104e") { id } }' })   // This eventId's title is "Party"
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });  
        });
});

describe('GraphQL query - Booking', () => {

    before(`login - Obtain JWT token`, (done) => {
        request.post('/graphql')
            .send({ query: '{ login(email: "creator1", password: "test") { token } }' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                jwtToken = res.body.data.login.token;
                done();
            });
        });

    it('booking - Logged in user can query a booking', (done) => {
        request.post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({ query: '{ booking(id:"5d89db6f0f09f630044379f7") { eventId { title } userId { email } } }' })   // This eventId's title is "Party"
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.booking;
                queryResult.eventId.title.should.equal('Art');
                queryResult.userId.email.should.equal('user1');
                done();
            });  
        });

    it('bookings - Logged in user can query all bookings', (done) => {
        request.post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({ query: '{ bookings { eventId { title } userId { email } } }' })   // This eventId's title is "Party"
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
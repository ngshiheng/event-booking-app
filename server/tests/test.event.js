let chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const url = `http://localhost:8000`;
const request = require('supertest')(url);

describe('Event - Query', () => {
    it(`event - Query an event with id`, done => {
        request
            .post('/graphql')
            .send({
                query:
                    '{ event(id:"5d89c9639899a819f8d3104e") { id title description price date creatorId { id }} }',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.event;
                queryResult.title.should.equal('Party');
                queryResult.should.have.property('id');
                queryResult.should.have.property('title');
                queryResult.should.have.property('description');
                queryResult.should.have.property('price');
                queryResult.should.have.property('date');
                queryResult.should.have.property('creatorId');
                queryResult.creatorId.should.have.property('id');
                done();
            });
    });

    it('events - Query all existing events', done => {
        request
            .post('/graphql')
            .send({
                query:
                    '{ events { id title description price date creatorId { id } } }',
            })
            .expect(200)
            .end((err, res) => {
                // res will contain array of all users
                if (err) return done(err);
                resultArray = res.body.data.events;

                for (let i = 0; i < resultArray.length; i++) {
                    resultArray[i].should.have.property('id');
                    resultArray[i].should.have.property('title');
                    resultArray[i].should.have.property('description');
                    resultArray[i].should.have.property('price');
                    resultArray[i].should.have.property('date');
                    resultArray[i].should.have.property('creatorId');
                    resultArray[i].creatorId.should.have.property('id');
                }
                // res.body.data.events.should.have.lengthOf(7);
                done();
            });
    });
});

describe('Event - Mutation', () => {
    before(`login - Obtain JWT token`, done => {
        request
            .post('/graphql')
            .send({
                query:
                    '{ login(email: "creator1", password: "test") { token } }',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                jwtToken = res.body.data.login.token;
                done();
            });
    });

    it('createEvent - Logged in user can create event', done => {
        request
            .post('/graphql')
            .set('Authorization', 'Bearer ' + jwtToken)
            .send({
                query:
                    'mutation { createEvent(title:"Mocha", description:"Event created by Mocha test", price:69.69, date:"2020-02-24T07:43:59.039+00:00") { id } }',
            })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                // Use ORM to check if event is created on database
                // Need to use ORM to delete event after creation
                done();
            });
    });
});

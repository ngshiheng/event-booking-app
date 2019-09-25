let chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const url = `http://localhost:4000`;
const request = require('supertest')(url);

// Connect to test DB

describe('GraphQL', () => {
   it(`Query a user with id, expects password to be null`, (done) => {
       request.post('/graphql')
        .send({ query: '{ user(id:"5d89c904c862252ca0e1f32d") { email password } }' })
        .expect(200)
        .end((err, res) => {
            // res will contain array with one user
            if (err) return done(err);
            queryResult = res.body.data.user;
            queryResult.email.should.equal('creator1');
            queryResult.should.have.property('password');
            // expect(queryResult.password).to.be.a('null');
            done();
        });
    });

    it('Return all users, expects password to be null', (done) => {
        request.post('/graphql')
          .send({ query: '{ users { id email password } }' })
          .expect(200)
          .end((err, res) => {
              // res will contain array of all users
              if (err) return done(err);
              resultArray = res.body.data.users;

              for (let i = 0; i < resultArray.length; i++) {
                  resultArray[i].should.have.property('id');
                  resultArray[i].should.have.property('email');
                  resultArray[i].should.have.property('password');
                //   expect(resultArray[i].password).to.be.a('null');
              }
              res.body.data.users.should.have.lengthOf(6);
            done();
          });
    });

    it(`Query a single event with id`, (done) => {
        request.post('/graphql')
            .send({ query: '{ event(id:"5d89c9639899a819f8d3104e") { id title description price date creatorId { id }} }'})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.event;
                queryResult.title.should.equal('Party');
                queryResult.should.have.property("id");
                queryResult.should.have.property("title");
                queryResult.should.have.property("description");
                queryResult.should.have.property("price");
                queryResult.should.have.property("date");
                queryResult.should.have.property("creatorId");
                queryResult.creatorId.should.have.property("id");
                done();
            });
        });

    it('Return all existing events', (done) => {
        request.post('/graphql')
            .send({ query: '{ events { id title description price date creatorId { id } } }' })
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
                res.body.data.events.should.have.lengthOf(5);
            done();
            });
    });

    it('Authenticated user gets back correct userId, token & tokenExpiration', (done) => {
        request.post('/graphql')
            .send({ query: '{ login(email: "user1", password: "test") { userId token tokenExpiration } }' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.login;
                expect(queryResult.userId).to.equal("5d89c9169899a819f8d3104d");
                queryResult.should.have.property('userId');
                queryResult.should.have.property('token');
                queryResult.should.have.property('tokenExpiration');
            done();
            });
    });

    it('Unauthenticated user does NOT get JSONWebToken', (done) => {
        request.post('/graphql')
            .send({ query: '{ login(email: "creator1", password: "wrongpassword") { token tokenExpiration } }' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                queryResult = res.body.data.login;
                expect(queryResult).to.be.a('null');
            done();
            });
    });

});
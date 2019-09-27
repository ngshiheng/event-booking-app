let chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const url = `http://localhost:4000`;
const request = require('supertest')(url);


describe('GraphQL query - User', () => {
    it('login - Authenticated user gets back correct userId, token & tokenExpiration', (done) => {
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

    it('login - Unauthenticated user does NOT get JSONWebToken', (done) => {
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

   it(`user - Query a user with id`, (done) => {
       request.post('/graphql')
        .send({ query: '{ user(id:"5d89c904c862252ca0e1f32d") { id email createdEvents { id } } }' })
        .expect(200)
        .end((err, res) => {
            // res will contain array with one user
            if (err) return done(err);
            queryResult = res.body.data.user;
            queryResult.should.have.property('id');
            queryResult.email.should.equal('creator1');
            queryResult.should.have.property('createdEvents');
            done();
        });
    });

    it('users - Query all users', (done) => {
        request.post('/graphql')
          .send({ query: '{ users { id email createdEvents { id } } }' })
          .expect(200)
          .end((err, res) => {
              // res will contain array of all users
              if (err) return done(err);
              resultArray = res.body.data.users;

              for (let i = 0; i < resultArray.length; i++) {
                  resultArray[i].should.have.property('id');
                  resultArray[i].should.have.property('email');
                  resultArray[i].should.have.property('createdEvents');
              }
              res.body.data.users.should.have.lengthOf(6);
            done();
          });
    });
});
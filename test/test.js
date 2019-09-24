const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:4000`;
const request = require('supertest')(url);

describe('GraphQL', () => {
   it('Returns a user with id = 5d89c904c862252ca0e1f32d', (done) => {
       request.post('/graphql')
        .send({ query: '{ user(id:"5d89c904c862252ca0e1f32d") { email password } }' })
        .expect(200)
        .end((err, res) => {
            // res will contain array with one user
            if (err) return done(err);
            res.body.user.should.have.property('email');
            res.body.user.should.have.property('password');
            done();
        });
    }),

    it('Returns all users', (done) => {
        request.post('/graphql')
          .send({ query: '{ users { id email password } }' })
          .expect(200)
          .end((err, res) => {
              // res will contain array of all users
              if (err) return done(err);
              res.body.user.should.have.lengthOf(6);
            done();
          });
    });
});
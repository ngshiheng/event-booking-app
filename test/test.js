let chai = require('chai');
const should = chai.should();
const expect = chai.expect();
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
            res.body.data.user.email.should.equal('creator1');
            res.body.data.user.should.have.property('password');
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
              resultArray = res.body.data.users;

              for (let i = 0; i < resultArray.length; i++) {
                  resultArray[i].should.have.property('id');
                  resultArray[i].should.have.property('email');
                  resultArray[i].should.have.property('password');
              }
              res.body.data.users.should.have.lengthOf(6);
            done();
          });
    });
});
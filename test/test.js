let chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const url = `http://localhost:4000`;
const request = require('supertest')(url);

// Connect to test DB

describe('GraphQL', () => {
   it(`Returns a user with id: "5d89c904c862252ca0e1f32d", expects password to be null`, (done) => {
       request.post('/graphql')
        .send({ query: '{ user(id:"5d89c904c862252ca0e1f32d") { email password } }' })
        .expect(200)
        .end((err, res) => {
            // res will contain array with one user
            if (err) return done(err);
            res.body.data.user.email.should.equal('creator1');
            res.body.data.user.should.have.property('password');
            expect(res.body.data.user.password).to.be.a('null');
            done();
        });
    });

    it('Returns all users, expects password to be null', (done) => {
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
                  expect(resultArray[i].password).to.be.a('null');
              }
              res.body.data.users.should.have.lengthOf(6);
            done();
          });
    });

    it(`Return an event with id: "5d89c9639899a819f8d3104e"`, (done) => {
        request.post('/graphql')
            .send({ query: '{ event(id:"5d89c9639899a819f8d3104e") { id title description price date creatorId { id }} }'})
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                res.body.data.event.should.have.property("id");
                res.body.data.event.should.have.property("title");
                res.body.data.event.should.have.property("description");
                res.body.data.event.should.have.property("price");
                res.body.data.event.should.have.property("date");
                res.body.data.event.should.have.property("creatorId");
                res.body.data.event.creatorId.should.have.property("id");
                done();
            });
        });

    it('Returns all events', (done) => {
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
});
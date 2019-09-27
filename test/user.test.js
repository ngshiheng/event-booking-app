const app = require("../app.js");
const supertest = require("supertest");
const request = supertest(app);

const mongoose = require("mongoose");

// beforeAll(async () => {
//   const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-jerry-wfbgv.mongodb.net/${process.env.MONGO_TEST_DB}?retryWrites=true&w=majority`;
//   await mongoose.connect(URI, { useNewUrlParser: true });
// });

describe('GraphQL queries', () => {
  it(`user - Query a user with id`, async done => {
    const res = await request.post('/graphql')
      .send({
        query: '{ user(id:"5d89c904c862252ca0e1f32d") { id email createdEvents { id } } }'
      })
      .expect(200);

      queryResult = res.body.data.user;
      expect(queryResult.id).toBe("5d89c904c862252ca0e1f32d");
      expect(queryResult.email).toBe("creator1");
      expect(queryResult).toHaveProperty('createdEvents');
    done();
  });
});
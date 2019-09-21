const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
// Exports a middleware function, take incoming requests and funnel them to the graphQL query parser
const graphqlHTTP = require('express-graphql');

// Database
const Event = require('./models/event');
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-jerry-wfbgv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser:true }
)
.then (() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

// Schema
const { buildSchema } = require('graphql');
app.use(bodyParser.json());
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }   
    `),
    rootValue: {
        events: () => {
            // We can filter using:
            // Event.find({title: 'A test'});
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return event;
                    });
                })
                .catch(err => {
                throw err;
            });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
            });
            event
                .save()
                .then(result => {
                console.log(result);
                return result;
            })
                .catch(err => {
                console.log(err);
                throw err;
            });
        }
    },
    graphiql: true,
}));
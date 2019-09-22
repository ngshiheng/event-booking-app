const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
// Exports a middleware function, take incoming requests and funnel them to the graphQL query parser
const graphqlHTTP = require('express-graphql');

// Database
const Event = require('./models/event');
const User = require('./models/user');
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

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
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
        createEvent: args => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5d872e6593fddd4b5c7cc5ef',
            });
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = { result };
                    return User.findById('5d872e6593fddd4b5c7cc5ef');
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User does not exists.');
                    }
                    user.createEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                console.log(err);
                throw err;
            });
        },
        createUser: (args) => {
            return User.findOne({email: args.userInput.email})
                .then(user => {
                    if (user) {
                        throw new Error('User exists already.');
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    return result;
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true,
}));
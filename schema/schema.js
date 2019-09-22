const graphql = require("graphql");
const Event = require('../models/event');
const User = require('../models/user');

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt ,
    GraphQLSchema,
    GraphQLID,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
} = graphql;

const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type:GraphQLString},
        description: {type:GraphQLString},
        price: {type:GraphQLFloat},
        date: {type:GraphQLString},
        creator: {
            type: UserType,
            resolve(parent, args) {
                return UserType.findById(parent.creatorId);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        events: {
            type: new GraphQLList(EventType),
            resolve(parent, args) {
                return Event.find({creatorId: parent.id});
            }
        }
    })
});

// Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        event: {
            type: EventType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return Event.findById(args.id);
            }
        },

        events: {
            type: new GraphQLList(EventType),
            resolve(parent, args) {
                return Event.find({});
            }
        },

        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},

            resolve(parent, args) {
                return User.findById(args.id);
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        }
    }
});

// Mutation
const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        createEvent: {
            type: EventType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                date: { type: new GraphQLNonNull(GraphQLString) },
                creatorId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parents, args) {
                let event = new Event({
                    title: args.title,
                    description: args.description,
                    price: args.price,
                    date: args.date,
                    creatorId: args.creatorId,
                });
                return event.save();
            }
        },

        createUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parents, args) {
                let user = new User({
                    email: args.email,
                    password: args.password,
                });
                return user.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
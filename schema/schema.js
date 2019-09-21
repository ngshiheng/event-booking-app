const graphql = require("graphql");
const Event = require('../models/event');

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
            },
            resolve(parents, args) {
                let event = new Event({
                    title: args.title,
                    description: args.description,
                    price: args.price,
                    date: args.date,
                });
                return event.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
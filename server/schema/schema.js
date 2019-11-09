const graphql = require('graphql');
const Event = require('../models/event');
const User = require('../models/user');
const Booking = require('../models/booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
} = graphql;
const GraphQLDate = require('graphql-date');

// UserDataType does not have password in its fields.
const UserDataType = new GraphQLObjectType({
    name: 'UserData',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        createdEvents: {
            type: new GraphQLList(EventType),
            resolve(parent, args) {
                return Event.find({ creatorId: parent.id });
            },
        },
    }),
});

const AuthDataType = new GraphQLObjectType({
    name: 'AuthData',
    fields: () => ({
        userId: { type: GraphQLID },
        token: { type: GraphQLString },
        tokenExpiration: { type: GraphQLInt },
    }),
});

const BookingType = new GraphQLObjectType({
    name: 'Booking',
    fields: () => ({
        id: { type: GraphQLID },
        eventId: {
            type: EventType,
            resolve(parent, args) {
                return Event.findById(parent.eventId);
            },
        },
        userId: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
            },
        },
        createdAt: { type: GraphQLDate },
        updatedAt: { type: GraphQLDate },
    }),
});

const EventType = new GraphQLObjectType({
    name: 'Event',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        date: { type: GraphQLDate },
        creatorId: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.creatorId);
            },
        },
    }),
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        createdEvents: {
            type: new GraphQLList(EventType),
            resolve(parent, args) {
                return Event.find({ creatorId: parent.id });
            },
        },
    }),
});

// Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: AuthDataType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args) {
                let user;
                try {
                    user = await User.findOne({ email: args.email });
                    if (!user) {
                        throw err;
                    }
                } catch (error) {
                    throw new Error('User does not exist!');
                }
                let isEqual;
                isEqual = await bcrypt.compare(args.password, user.password);
                if (isEqual) {
                    const token = jwt.sign(
                        { userId: user.id, email: user.email },
                        'somesupersecretkey',
                        {
                            expiresIn: '1h',
                        },
                    );
                    return {
                        userId: user.id,
                        token: token,
                        tokenExpiration: 1,
                    };
                } else {
                    throw new Error('Wrong password!');
                }
            },
        },

        booking: {
            type: BookingType,
            args: { id: { type: GraphQLID } },
            async resolve(parent, args, req) {
                if (!req.isAuth) {
                    throw new Error('Unauthenticated!');
                }
                return Booking.findById(args.id);
            },
        },

        bookings: {
            type: new GraphQLList(BookingType),
            async resolve(parent, args, req) {
                if (!req.isAuth) {
                    throw new Error('Unauthenticated!');
                }
                // Authenticated users can only see their own bookings:
                return Booking.find({ userId: req.userId });
            },
        },

        event: {
            type: EventType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Event.findById(args.id);
            },
        },

        events: {
            type: new GraphQLList(EventType),
            resolve(parent, args) {
                return Event.find({});
            },
        },

        user: {
            type: UserDataType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            },
        },

        users: {
            type: new GraphQLList(UserDataType),
            resolve(parent, args) {
                return User.find({});
            },
        },
    },
});

// Mutation
const RootMutation = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        bookEvent: {
            type: BookingType,
            args: {
                eventId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parents, args, req) {
                if (!req.isAuth) {
                    throw new Error('Unauthenticated!');
                }
                let booking = new Booking({
                    eventId: args.eventId,
                    userId: req.userId,
                });
                return booking.save();
            },
        },

        // Authenticated user can only cancel bookings made by themselves
        cancelBooking: {
            type: BookingType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args, req) {
                if (!req.isAuth) {
                    throw new Error('Unauthenticated!');
                }
                return await Booking.findOne({ _id: args.id })
                    .then(booking => {
                        if (booking && booking.userId == req.userId) {
                            return Booking.deleteOne({ _id: booking.id });
                        } else {
                            throw new Error(`Booking no longer exist`);
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            },
        },

        createEvent: {
            type: EventType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                date: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parents, args, req) {
                if (!req.isAuth) {
                    throw new Error('Unauthenticated!');
                }

                let event = new Event({
                    title: args.title,
                    description: args.description,
                    price: args.price,
                    date: args.date,
                    creatorId: req.userId,
                });
                return event.save();
            },
        },

        createUser: {
            type: UserType,
            args: {
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                return await User.findOne({ email: args.email })
                    .then(user => {
                        if (user) {
                            throw new Error('Email already exists.');
                        }
                        return bcrypt.hash(args.password, 12);
                    })
                    .then(hashedPassword => {
                        let user = new User({
                            email: args.email,
                            password: hashedPassword,
                        });
                        return user.save();
                    })
                    .then(result => {
                        return {
                            ...result._doc,
                            password: null,
                            id: result.id,
                        };
                    });
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});

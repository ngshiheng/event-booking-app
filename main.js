const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Database connection
const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-jerry-wfbgv.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(URI, { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log("Connected to database!");
});

// Middleware
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log("Now listening to port 4000.");
});
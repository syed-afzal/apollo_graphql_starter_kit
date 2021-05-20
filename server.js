const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const DataLoader = require('dataloader');
const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');
const { connection } = require('./db/utils');
const { verifyUser } = require('./helper/context');
const loaders = require('./loaders');

// set env variables
dotEnv.config();

const app = express();

// db connectivity
connection();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

// const userLoader =  new DataLoader(keys => loaders.user.batchUsers(keys))

const apolloServer = new ApolloServer({
   typeDefs,
   resolvers,
    context: async ({ req }) => {
       await verifyUser(req);
        return {
           email: req.email,
           loggedInUserId: req.loggedInUserId,
           loaders: {
             user: new DataLoader(keys => loaders.user.batchUsers(keys)),
             // for caching the data
             // user: userLoader
           }
        }
    }
});

apolloServer.applyMiddleware({app, path:'/graphql'});

const PORT = process.env.PORT | 3000;

app.use('/', (req, res, next) => {
    res.send('Hello');
});

app.listen(PORT, () => {
   console.log(`Server is up on PORT ${PORT}`);
   console.log(`GraphQl endpoint ${apolloServer.graphqlPath}`);
});

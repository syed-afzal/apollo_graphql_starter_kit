const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { tasks, user } = require('./constants');

// set env variables
dotEnv.config();

const app = express();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    greetings: String
    tasks: [Task!]
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
  }
  
  type Task {
    id: ID!
    name: String!
    completed: Boolean!
    user: User!
  }
`;

const resolvers = {
    Query: {
        greetings: () => "Hello",
        tasks: () => tasks  // query level resolver
    },
    Task: {
        // Field level resolver and it has higher priority than query level resolver
        user: ({userId}) => user.find( user => user.id === userId)
    }
};

const apolloServer = new ApolloServer({
   typeDefs,
   resolvers
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

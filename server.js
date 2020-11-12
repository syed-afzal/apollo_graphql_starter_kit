const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { tasks, users } = require('./constants');

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
    task(id: ID!): Task
    users: [User!]
    user(id: ID!): User
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
        tasks: () => tasks, // query level resolver
        task: (_, { id }) => tasks.find(task => task.id == id),
        users: () => users,
        user:(_, { id }) => users.find(user => user.id == id)
    },
    // Field level resolver and it has higher priority than query level resolver
    Task: {
        user: ({userId}) => users.find( user => user.id === userId)
    },
    User: {
        tasks: ({ id }) => tasks.filter(task => task.id == id)
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

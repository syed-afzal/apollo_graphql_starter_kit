<h1 align="center"> 🚀 Apollo GraphQL Starter Kit 🚀 </h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
<!--     <img alt="Version" src="https://img.shields.io/badge/build-passing-brightgreen" /> -->
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

### 🏠 [Homepage](https://github.com/syed-afzal/apollo_graphql_starter_kit)

## Overview :clipboard:

GraphQL API Server with Apollo, Node.js, MongoDB. Jwt Authentication, Cursor Pagination, DB Query Batching & Caching.

#### The features which covered are as follows.

♦ Build GraphQL API with Apollo Server in Node.js, Express, and MongoDB.

♦ Add JWT Authentication in Apollo GraphQL API.

♦ Implement Faster pagination with Cursor Based Pagination Strategy.The code of offset limit pagination is also there.

♦ Add Data Loaders to return data faster from the server with batching and caching your database query.

♦ Feel Confident with GraphQL Concepts such as Query, Mutation, and Subscription.

♦ Best practices in GraphQL and Build Scalable API with proper schema design.

It's sound good  :ok_hand: , so let's start :runner:

## Prerequisite

To understand the code you should have a basic knowledge of [MongoDB](https://www.mongodb.com/), [NodeJS](https://nodejs.org/), 
[Express](https://expressjs.com/) & my favourite language [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Steps to Run the Project

#### ♦ Setting up ENV file

Rename env.example to .env and fill in the details

```bash
PORT=
MONGO_DB_URL=
JWT_SECRET_KEY=
```
#### ♦ Install dependencies

```bash
npm install
```

then RUN the command 

```bash
npm run dev
```

it will run the the project in development mode using nodemon

## Sample GraphQL Schema

```sh
const { gql } = require('apollo-server-express');

module.exports =  gql`
  extend type Query {
    user: User
  }
  
  extend type Mutation {
    signup(input: signupInput): User
    login(input: loginInput): Token
  }
  
  input signupInput {
    name: String!
    email: String!
    password: String!
  }
  
   input loginInput {
    email: String!
    password: String!
  }
  
  type Token {
    token: String!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    tasks: [Task!]
    createdAt: Date!
    updatedAt: Date!
  }
  
  extend type Subscription {
    userCreated: User
  }
`;
```

No need to 😕 confuse it's a syntax to define Schema in **GraphQl**.

## Explanation

###### :clipboard: `Note: we used extend for Mutation, Query & Subscription because we defining all these in main server.js file`


##### ♦ Query

Query means to fetch the data from DB.
We extend for Query and we only have a query for user here, we can add more modules there as well.

##### ♦ Mutation

Mutation means to Create/Update/Delete the record from DB.
As you can see it is also extended like query but here we use two mutation.
The purpose of mutation is to edit/delete the data.

##### ♦ Subscription

Like queries, subscriptions enable you to fetch data. Unlike queries, subscriptions are long-lasting operations that can change their result over time.
Subscriptions are useful for notifying your client in real time about changes to back-end data, such as the creation of a new object or updates to an important field.


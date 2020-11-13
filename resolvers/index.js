const { GraphQLDateTime } = require('graphql-iso-date');

const userResolver = require('./user');
const taskResolver = require('./task');

const customeDateScalarResolver =  {
    Date: GraphQLDateTime
};

module.exports = [
    userResolver,
    taskResolver,
    customeDateScalarResolver
];

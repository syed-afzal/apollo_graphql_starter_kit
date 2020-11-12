const { users } = require('../constants');

module.exports =  {
    Query: {
        users: () => users,
        user:(_, { id }) => users.find(user => user.id == id)
    },
    // Field level resolver and it has higher priority than query level resolver
    Task: {
        user: ({userId}) => users.find( user => user.id == userId)
    },
};

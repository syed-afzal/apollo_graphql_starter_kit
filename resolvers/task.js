const { tasks, users } = require('../constants');
const uuid = require('uuid');

module.exports = {
    Query: {
        tasks: () => tasks, // query level resolver
        task: (_, { id }) => tasks.find(task => task.id == id),
    },
    Mutation: {
        createTask: (_, { input }) => {
            const task = {...input, id: uuid.v4()}
            tasks.push(task);
            return task;
        }
    },
    // Field level resolver and it has higher priority than query level resolver
    Task: {
        user: ({userId}) => users.find( user => user.id == userId)
    }
};

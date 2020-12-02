const { tasks, users } = require('../constants');
const User = require('../db/models/user');
const Task = require('../db/models/task');
const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated } = require('./middleware');

module.exports = {
    Query: {
        tasks: () => tasks, // query level resolver
        task: (_, { id }) => tasks.find(task => task.id == id),
    },
    Mutation: {
        createTask: combineResolvers(isAuthenticated,  async(_, { input }, { email }) => {
            try {
                const user = await User.findOne({ email });
                const task = new Task({ ...input, user: user.id });
                await task.save();
                user.tasks.push(task.id);
                await user.save();
                return task;
            } catch (e) {
                console.error(e);
                throw e;
            }
        })
    },
    // Field level resolver and it has higher priority than query level resolver
    Task: {
        user: ({userId}) => users.find( user => user.id == userId)
    }
};

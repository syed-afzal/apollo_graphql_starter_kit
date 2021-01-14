const { tasks, users } = require('../constants');
const User = require('../db/models/user');
const Task = require('../db/models/task');
const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isTaskOwner } = require('./middleware');

module.exports = {
    Query: {
        /* tasks: () => tasks, // query level resolver */
        tasks: combineResolvers(isAuthenticated, async (_, __, { loggedInUserId }) => {
            try {
                const tasks = await Task.find({ user: loggedInUserId });
                return tasks;
            } catch (e) {
                console.err(e);
                throw e;
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
            try {
                const task = await Task.findById(id);
                return task;
            } catch (e) {
                console.error(e);
                throw e;
            }
        })
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
        }),

        updateTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id, input }) => {
            try {
                return await Task.findByIdAndUpdate(id,
                  { ...input },
                  { new: true });
            } catch (e) {
                console.error(e);
                throw e;
            }
        })
    },
    // Field level resolver and it has higher priority than query level resolver
    Task: {
        user: async (parent) => {
            try {
                const user = await User.findById(parent.user);
                return user;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }
};

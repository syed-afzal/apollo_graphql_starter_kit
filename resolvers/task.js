const User = require('../db/models/user');
const Task = require('../db/models/task');
const { combineResolvers } = require('graphql-resolvers');
const { isAuthenticated, isTaskOwner } = require('./middleware');

module.exports = {
    Query: {
        /* tasks: () => tasks, // query level resolver */
        tasks: combineResolvers(isAuthenticated, async (_, { cursor, limit=0 }, { loggedInUserId }) => {
            try {
                const query = { user: loggedInUserId };
                if (cursor) {
                    query['_id'] = {
                        '$lt': cursor
                    }
                };
                const tasks = await Task.find(query)
                  .sort({ _id: -1 })
                  .limit(limit);
                return tasks;
            } catch (e) {
                console.err(e);
                throw e;
            }
        }),
        task: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }) => {
            try {
                return await Task.findById(id);
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
        }),

        deleteTask: combineResolvers(isAuthenticated, isTaskOwner, async (_, { id }, { loggedInUserId }) => {
           const task = await Task.findByIdAndDelete(id);
           await User.updateOne({_id: loggedInUserId}, { $pull: { tasks: task.id } });
            return task;
        }),
    },
    // Field level resolver and it has higher priority than query level resolver
    Task: {
        user: async (parent) => {
            try {
                return await User.findById(parent.user);
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    }
};

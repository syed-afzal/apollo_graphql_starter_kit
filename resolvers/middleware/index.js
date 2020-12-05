const { skip } = require('graphql-resolvers');
const Task = require('../../db/models/task');

module.exports.isAuthenticated = (_, __, { email }) => {
  if(!email) {
      throw new Error("Access Denied! Please login to continue");
  }
  return skip;
};

module.exports.isTaskOwner = async (_, { id }, { loggedInUserId }) => {
    try {
        const task = await Task.findById(id);
        if (!task) {
            throw new Error("Task not found")
        } else if (task.user.toString() !== loggedInUserId ) {
            throw new Error("Not authorized as task owner");
        }
        return skip;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

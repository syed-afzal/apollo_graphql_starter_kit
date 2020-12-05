const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { combineResolvers } = require('graphql-resolvers');

const { users } = require('../constants');
const User = require('../db/models/user');
const Task = require('../db/models/task');
const { isAuthenticated } = require('./middleware');

module.exports =  {
    Query: {
        user: combineResolvers(isAuthenticated, async (_, __, { email }) => {
            console.log('==email== ', email);
            try {
                const user = User.findOne({email});
                if (!user) {
                    throw new Error("User not found")
                }
                return user;
            } catch(e) {
                console.error(e);
                throw e;
            }
        })
    },
    Mutation: {
        signup: async (_, { input }) => {
            try {
                const user = await User.findOne({ email: input.email });
                if (user) {
                    throw new Error('Email already exist');
                }
                const hashPassword = await bcrypt.hash(input.password, 12);
                const newUser = new User({...input, password: hashPassword});
                return await newUser.save();
            } catch (e) {
                console.log(e);
                throw e
            }
        },
        login: async (_, { input }) => {
            try {
                const user = await User.findOne({ email: input.email });
                if (!user)
                    throw new Error('User not found');
                const isPasswordValid = await bcrypt.compare(input.password, user.password);
                if (!isPasswordValid)
                    throw new Error('Incorrect Password');
                const secret =  process.env.JWT_SECRET_KEY || 'mysecretkey';
                const token = jwt.sign( { email: user.email }, secret, { expiresIn: '1d' });
                return { token };
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
    },
    // Field level resolver and it has higher priority than query level resolver
    User: {
        tasks: async ( { id }) => {
            try {
                const task = await Task.find({user: id});
                return task;
            } catch (e) {
                console.error(e);
                throw e;
            }
        }
    },
};

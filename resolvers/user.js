const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { users } = require('../constants');
const User = require('../db/models/user');

module.exports =  {
    Query: {
        users: () => users,
        user:(_, { id }, { email }) => {
            console.log('==email== ', email);
            return users.find(user => user.id == id)
        }
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
    Task: {
        user: ({userId}) => users.find( user => user.id == userId)
    },
};

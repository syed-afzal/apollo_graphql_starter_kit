const jwt = require('jsonwebtoken');
const User = require('../../db/models/user');

module.exports.verifyUser = async (req) => {
    try {
        req.loggedInUserId = null;
        req.email = null;
        const bearerHeader = req.headers.authorization;
        if(bearerHeader) {
            const token = bearerHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey');
            req.email = payload.email;
            const user = await User.findOne({ email: payload.email });
            req.loggedInUserId = user._id;
        }
    } catch (e) {
        throw e;
    }
};

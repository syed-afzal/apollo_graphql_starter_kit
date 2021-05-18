const mongoose = require('mongoose');

module.exports.connection = async () => {
    try {
        mongoose.set('debug', true);
        await mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        console.log('DataBase Connection Successful');
    } catch (e) {
        console.log('DB Error', e);
        throw e;
    }
};

module.exports.isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

const mongoose = require('mongoose')

const apiUserStatSchema = new mongoose.Schema({
    date: {
        type: String,
        default: new Date().toISOString().substring(0, 10)
    },
    stats: [{
        user: String,
        apiAccessCount: {
            type: Number,
            default: 1
        }
    }]
});

module.exports = mongoose.model('apiUserStat', apiUserStatSchema) //apiStat is the name of the collection in the db

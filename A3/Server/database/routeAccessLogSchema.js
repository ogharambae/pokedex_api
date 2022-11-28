const mongoose = require('mongoose')

const routeAccessLogSchema = new mongoose.Schema({
    endpoint: String,
    date: {
        type: Date,
        default: Date.now
    },
    status: Number,
    method: String
});

module.exports = mongoose.model('routeAccessLog', routeAccessLogSchema) //routeAccessLog is the name of the collection in the db

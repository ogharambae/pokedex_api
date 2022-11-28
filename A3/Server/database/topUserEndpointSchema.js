const mongoose = require('mongoose')

const topUserEndpointSchema = new mongoose.Schema({
    endpoint: String,
    access: [{
        user: String,
        count: {
            type: Number,
            default: 1
        }
    }]
});

module.exports = mongoose.model('topUserEndpoint', topUserEndpointSchema) // topUserEndpoint is the name of the collection in the db

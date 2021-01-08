const mongoose = require('mongoose');

const waterstationSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    // waterstations: Pump station, Dam, Community Pump, Well
    station: {
        type: String,
        required: true
    },
    // capacity: the number of people each stations can serve
    capacity: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Waterstation',waterstationSchema) 
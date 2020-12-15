const mongoose = require('mongoose')
const schema = mongoose.Schema

const session = new schema({
    course : String,
    instructor : String,
    day : Number, //0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday ....
    slot : Number, //1 for first, 2 for second, 3 for third ...
})

const LocationSchema = new schema({
    name: String,
    schedule: [session],
    capacity: Number,
    type: String,
    currCapacity:{type:Number, default:0}
})

module.exports = mongoose.model('Location', LocationSchema)

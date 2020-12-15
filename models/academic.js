const mongoose = require('mongoose')
const schema = mongoose.Schema

const session = new schema({
    course : String,
    location : String,
    day : Number, //0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday ....
    slot : Number, //1 for first, 2 for second, 3 for third ...
})

const AcademicSchema = new schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        default: "123456"
    },
    id: {
        type: String,
        unique: true,
    },

    name: String,
    attendance_records: Array,
    sign_in_out: Array,

    missing_days: {
        type: Number,
        default: 0
    },
    missing_hours: {
        type: Number,
        default: 0
    },
    extra_hours: {
        type: Number,
        default: 0
    },

    salary: Number,
    office_location: String,
    day_off: String,
    courses: Array, //array of string
    department: String,
    faculty: String,
    gender:String,
    Schedule: [session],
    personalInfo : String,
    sent_requests : Array,
    received_requests : Array,
    position : String
})

module.exports = mongoose.model('Academic', AcademicSchema)

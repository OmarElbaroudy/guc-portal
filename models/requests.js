const mongoose=require('mongoose')
const schema =mongoose.Schema

const replacementRequest = new schema({
    course:String,
    slotDate : Date,
    slot : Number,
    location : String,
    status : String //accepted or rejected by receiver ta
})
const slotLinking = new schema({
    course: String,
    slot: Number,
    weekDay: Number
})

const requestSchema=new schema({
 Status:String,//pending, rejected, accepted by hod
 type:String, //Replacement,slotLinking
 sender_comment:String,
 receiver_comment:String,
 department:String,
 sender:String,
 receiver:String,
 issue_date : Date,
 replacementRequest : replacementRequest,
 slotLinking : slotLinking,
 targetDate : Date, //sick, accidental, maternity 
 new_day_off:Number
})

module.exports=mongoose.model('request', requestSchema)

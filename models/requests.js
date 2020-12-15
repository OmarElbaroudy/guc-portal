const mongoose=require('mongoose')
const schema =mongoose.Schema

const replacementRequest = new schema({
    course:String,
    slotDate : Date,
    slot : Number,
    location : String,
    status : String //accepted or rejected by receiver ta
})

const requestSchema=new schema({
 Status:String,//pending, rejected, accepted by hod
 type:String, //Replacement, 
 sender_comment:String,
 receiver_comment:String,
 department:String,
 sender:String,
 receiver:String,
 issue_date : Date,
 replacementRequest : replacementRequest,
 targetDate : Date //sick, accidental, maternity 
})

module.exports=mongoose.model('request', requestSchema)

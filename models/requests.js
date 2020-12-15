const mongoose=require('mongoose')
const schema =mongoose.Schema

const replacementRequest = new schema({
    course:String,
    day : Date,
    slot : Number,
    location : String,
})

const requestSchema=new schema({
 Status:String,
 type:String,
 sender_comment:String,
 receiver_comment:String,
 department:String,
 sender:String,
 receiver:String,
 issue_date : Date,
 replacementRequests : [replacementRequest]

})

module.exports=mongoose.model('request', requestSchema)

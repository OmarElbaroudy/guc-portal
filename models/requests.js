const mongoose=require('mongoose')
const schema =mongoose.Schema
const requestSchema=new schema({
 request_ID:String,
 Status:String,
 type:String,
 sender_comment:String,
 reciever_comment:String,
 dpartment:String,
 sender:String,
 reciever:String,
 course:String
})
module.exports=mongoose.model('request', requestSchema)
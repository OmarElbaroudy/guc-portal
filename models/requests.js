const mongoose=require('mongoose')
const schema =mongoose.Schema
const requestSchema=new schema({
 Status:String,
 type:String,
 sender_comment:String,
 receiver_comment:String,
 department:String,
 sender:String,
 receiver:String,
 course:String,
 day : Date,
 slot : Number,
 location : String,
})
module.exports=mongoose.model('request', requestSchema)

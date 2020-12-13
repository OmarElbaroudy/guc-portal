const mongoose=require('mongoose')
const schema =mongoose.Schema
const LocationSchema=new schema({
 name:String,
 object:Array,
 capacity:Number,
 type:String
})
module.exports=mongoose.model('Location', LocationSchema)
const mongoose=require('mongoose')
const schema =mongoose.Schema
const FacultySchema=new schema({
  name:String,
})
module.exports=mongoose.model('Faculty', FacultySchema)
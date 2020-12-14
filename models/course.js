const mongoose=require('mongoose')
const schema =mongoose.Schema
const CourseSchema=new schema({
  department:String,
  faculty:String,
  hod:String,
  instructors_ID:Array,
  TAs_ID:Array,
  coordinator_ID:String

})
module.exports=mongoose.model('Course', CourseSchema)
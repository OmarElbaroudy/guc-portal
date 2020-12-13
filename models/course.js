const mongoose=require('mongoose')
const schema =mongoose.Schema
const CourseSchema=new schema({
  department:String,
  faculty:String,
  hod:Number,
  instructors_ID:Array,
  TAs_ID:Array,
  coordinator_ID:Number

})
module.exports=mongoose.model('Course', CourseSchema)
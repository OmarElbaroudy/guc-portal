const mongoose=require('mongoose')
const schema =mongoose.Schema
const CourseSchema=new schema({
  name:String,
  department:String,
  faculty:String,
  hod:String,
  instructors_ID:Array,
  TAs_ID:Array,
  coordinator_ID:String,
  course_coverage:Number,
  schedule:Array,
  Max_num_slots:Number

})
module.exports=mongoose.model('Course', CourseSchema)
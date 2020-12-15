const mongoose=require('mongoose')
const schema =mongoose.Schema

const session = new schema({
  instructor : String,
  location : String,
  day : Number, //0 for Sunday, 1 for Monday, 2 for Tuesday, 3 for Wednesday ....
  slot : Number, //1 for first, 2 for second, 3 for third ...
})

const CourseSchema=new schema({
  name:String,
  department:String,
  faculty:String,
  hod:String,
  instructors_ID:Array,
  TAs_ID:Array,
  coordinator_ID:String,
  course_coverage:Number,
  schedule:[session],
  Max_num_slots:Number

})
module.exports=mongoose.model('Course', CourseSchema)
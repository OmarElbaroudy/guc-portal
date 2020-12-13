const mongoose=require('mongoose')
const schema =mongoose.Schema
const HRSchema=new schema({
  email:{
      type:String,
    unique: true,
    required: true
    } ,
  password:{
      type:Number,
      default:"123456"
  },
  id:{
      type:String,
    unique: true,
  },
  name: String,
  attendance_records: Array,
  sign_in_out:Array,
  missing_days:{
      typr:Number,
    default:0}
      ,
  missing_hours:{
    typr:Number,
  default:0},
  extra_hours:{
    typr:Number,
  default:0},
  salary:Number,
  office_location:String,
  day_off:{type:String,
    default:"Saturday"
},
  Schedule:Array

})
module.exports=mongoose.model('HR', HRSchema)
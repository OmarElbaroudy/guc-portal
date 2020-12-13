const mongoose=require('mongoose')
const schema =mongoose.Schema
const DepartmentSchema=new schema({
 name:String,
 faculty:String,
 hod_ID:Number,
 Staff_members_ID:Array,
 coordinator_ID:Number
})
module.exports=mongoose.model('Department', DepartmentSchema)
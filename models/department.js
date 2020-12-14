const mongoose=require('mongoose')
const schema =mongoose.Schema
const DepartmentSchema=new schema({
 name:String,
 faculty:String,
 hod_ID:String,
 Staff_members_ID:Array,
 coordinator_ID:String
})
module.exports=mongoose.model('Department', DepartmentSchema)
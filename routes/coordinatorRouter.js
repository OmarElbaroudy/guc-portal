const express = require("express");
const academic = require("../models/academic");
const courses = require("../models/course");
const department = require("../models/department");
const locations =  require("../models/locations");
const jwt_decode = require('jwt-decode');
const router = express.Router()
const app = express()
app.use(express.json())
let ac ="" ;

    const numOfDefined = (array)  =>{
        let number = 0 
        for(entry of array ){
            if(entry.instructorId!==undefined)
                number++
    }
    return number
    }          
    const instructorUndefined =  (object) => {
        return object.instructorId != null
    };
    
    
    const getCourseNameById = async (id) => {
        return await courses.findById(id).name;
    };
    
    const getCourseIdByName = async (name) => {
        const ret = await courses.findOne({ name: name });
        return ret ? ret._id : undefined;
    };
    const getAcademicIdById = async (id) => {
        const ret = await academic.findOne({ id: id });
        return ret ? ret._id : undefined;
    };
    const getlocationIdByName = async (name) => {
        const ret = await locations.findOne({ name: name });
        return ret ? ret._id : undefined;
    };
    
    const getDepartmentIdByName = async (name) => {
        const ret = await department.findOne({ name: name });
        return ret ? ret._id : undefined;
    };
    
    const getLocationNameById = async (id) => {
        return await locations.findById(id).name;
    };
    
    const getLocationIdByName = async (name) => {
        const ret = await locations.findOne({ name: name });
        return ret ? ret._id : undefined;
    };
    const auth= async (req,res,next)=>{
      
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
    
    
            ac = await academic.findOne({
                _id:decoded.id,
                "courses.position":"coordinator"
            })
            if(!ac)
            return res.status(403).send("unauthorized access")
    
            next()
    }

    router.route("/coordinator/addCourseSlot")
    .post(auth,async (req, res) => {
        let response = []
        let courseId = await getCourseIdByName(req.body.course)
        let course = await courses.findOne(
            {
                "coordinatorId":ac._id
            })
           
        
    
        
        let location = await locations.findOne(
            {
                "name":req.body.location
            })
        if(!location){
             res.send("this location is incorrect")
             return
        }
        if(req.body.weekDay>6 || req.body.weekDay<0 || req.body.slot > 5 || req.body.slot<1 ){
            res.send("check your slot or weekDay input")
            return
        }
        if(req.body.type!="tutorial" && req.body.type!="lecture" && req.body.type!="practical"){
            res.send("slot type is incorrect")
            return
        }
       
        let slot = await courses.findOne(
            {
                "_id":course._id,
                "schedule.locationId":location._id,
                "schedule.weekDay":req.body.weekDay,
                "schedule.slot":req.body.slot,
                "schedule.type":req.body.type

            })
        if(slot){
             res.send("This slot is already added")
             return
        }
        let slotLocationBusy = await courses.findOne(
            {
                "schedule.locationId":await getlocationIdByName(req.body.location),
                "schedule.weekDay":req.body.weekDay,
                "schedule.slot":req.body.slot,

            })
        if(slotLocationBusy){
             res.send("This location is busy at this time")
             return
        }

        let addedToLocation =  {courseId:course._id,
            weekDay:req.body.weekDay,
            slot:req.body.slot,
            type:req.body.type
       }
       let addedToCourse =  {locationId:location._id,
        weekDay:req.body.weekDay,
        slot:req.body.slot,
        type:req.body.type
   }


        location.schedule.push(addedToLocation)
        await location.save()
        

        course.schedule.push(addedToCourse)
        await course.save()
        
        
        res.send("Slot to course :" + course.name +" is added successfully")
    })


    router.route("/coordinator/deleteSlot")
    .post(auth,async (req, res) => {
        let response = []

        let course = await courses.findOne(
            {
                "coordinatorId":ac._id
            })
        let location = await locations.findOne(
            {
                "name":req.body.location
            })
        if(!location){
             res.send("this location is incorrect")
             return
        }
        if(req.body.weekDay>6 || req.body.weekDay<0 || req.body.slot > 5 || req.body.slot<1 ){
            res.send("check your slot or weekDay input")
            return
        }
        if(req.body.type!="tutorial" && req.body.type!="lecture" && req.body.type!="practical"){
            res.send("slot type is incorrect")
            return
        }
        let slot = await courses.findOne(
            {
                "_id":course._id,
                "schedule.locationId":location._id,
                "schedule.weekDay":req.body.weekDay,
                "schedule.slot":req.body.slot,
                "schedule.type":req.body.type

            })
        if(!slot){
             res.send("This slot doesn't exist")
             return
        }

        let slotAssigned = await courses.findOne(
            {
                "_id":course._id,
                 "schedule.instructorId":{ $ne: null },
                "schedule.locationId":await getlocationIdByName(req.body.location),
                "schedule.weekDay":req.body.weekDay,
                "schedule.slot":req.body.slot,
                "schedule.type":req.body.type

            })
         
        if(slotAssigned){
             res.send("This slot is already assgined to an academic")
             return
        }


        location.schedule = await location.schedule.filter( function(value){
            return  !value.courseId.equals( course._id)&&
             value.weekDay!==req.body.weekDay&&
             value.slot!==req.body.slot&&
             value.type!==req.body.type

        })
        await location.save()      
        
        course.schedule = await course.schedule.filter( function(value){
            return  !value.locationId.equals( location._id)&&
             value.weekDay!==req.body.weekDay&&
             value.slot!==req.body.slot&&
             value.type!==req.body.type

        })
        await course.save()      
       
        
        res.send("SLot deleted successfully")

          
      
    })




    module.exports = router

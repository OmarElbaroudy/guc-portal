const express = require("express");
const Academic = require("../models/academic");
const course = require("../models/course");
const locations =  require("../models/locations");
const jwt_decode = require('jwt-decode');
const router = express.Router()
const app = express()
app.use(express.json())
let h ="" ;
const auth= async (req,res,next)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "academic") {
        h = await Academic.findOne({
            id: decoded.id,
            type: "CI"
        })
        if(!h)
        return res.status(403).send("unauthorized access")

        next()
  }
}
    router.route("/CI/view_assigned_slots")
    .get(auth,async (req, res) => {
     
        let response = [] ;

   
        for (const entry of h.courses) {
            const x = await course.findOne({
                name : entry.name
            })
            console.log(x)
            if(x){
                 response.push({"course" : x.name ,"Assigned Slots" :x.schedule})
            }

          }
        
           res.send(response)
           
    })
    router.route("/CI/view_courses_coverage")
    .get(auth,async (req, res) => {

        let response = [] ;


 
         for (const entry of h.courses) {
            const x = await course.findOne({
                name : entry.name
            })
            if(x){
                 response.push({"course" : x.name , "coverage" : x.course_coverage + " %" })
            }

          }
        
           res.send(response)

           
    })

   

    router.route("/CI/view_course_department_staff")
    .post(auth,async (req, res) => {
        let response = []
        if(req.body.input==="department"){
            const x = await Academic.find(
                {
                    department:h.department
                })
                if(x)
                 response.push(x)
        }
        else if(req.body.input==="course"){
            for (const entry of h.courses) {
                console.log(entry.name)
                let x = await Academic.find(
                    {
                        "courses.name":entry.name
                        //type:"academic"
                    })
                    console.log(x)
                    if(x && x.length !=0)
                     response.push(x)
                x = await Academic.find(
                        {
                          "courses.name":entry.name
                        })
                        console.log(x)

                    if(x && x.length !=0)
                        response.push(x)
              }
        }
           res.send(response)
    })

    router.route("/CI/assign_to_slot")
    .post(auth,async (req, res) => {
        let response = []
        let x = await course.findOne(
            {
                "name":req.body.course
            })
        if(x.length==0){
             res.send("this course doesn't exit")
             return
        }
        console.log(x.schedule)
    
         let y = await Academic.findOne(
            {
                "courses.name":req.body.course,
                "id":h.id
            })
        if(!y){
             res.send("this course is not yours")
             return
        }
        y = await locations.findOne(
            {
                "name":req.body.location
            })
        if(!y){
             res.send("this location is incorrect")
             return
        }

        y = await locations.findOne(
            {
                "name":req.body.location,
                "schedule.day":req.body.day,
                "schedule.slot":req.body.slot

            })
        if(y){
             res.send("this location is busy at this slot in this day")
             return
        }
        y = await Academic.findOne(
            {
              "id":req.body.instructor
            })
        if(!y){
                res.send("this instructor doesn't exit")
                return
           }
        y = await Academic.findOne(
            {
              "id":req.body.instructor,
              "course.name":req.body.course
            })
        if(y){
                res.send("this instructor doesn't teach this course")
                return
           }
        
        

           course.updateOne( 
               {
            "name":req.body.course
        }, 
        { $push: { schedule: {
            instructor : req.body.instructor,
            location : req.body.location,
            day : req.body.day, 
            slot : req.body.slot
         }}
         }, { safe: true, upsert: true }, (err, data) => console.log(data))
     

        

        
        res.send(response)
    })


    

module.exports = router

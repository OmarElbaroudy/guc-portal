const express = require("express");
const Academic = require("../models/academic");
const course = require("../models/course");
const jwt_decode = require('jwt-decode');
const router = express.Router()

const auth= async (req,res,next)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "academic") {
        const h = await Academic.findOne({
            id: decoded.id,
            type: "HOD"
        })
        if(!h)
        return res.status(403).send("unauthorized access")

        next()
  }
}

router.route("/HOD/assign_course_instructor")
    .put(auth,async (req, res,next) => {

            const h = await Academic.findOne({
                id: decoded.id,
                type: "HOD"
            })

          // console.log(h);
            if (h) {
                const x = await Academic.findOne({
                    id: req.body.id
                })
                 const c= await course.findOne({
                         name: req.body.course_name
                 })
                 if(c){
                     if(c.department ===h.department){
                     c.instructors_ID.push(x.id)
                     c.save()
                     }
                 }
                 else{
                     console.log("not found")
                     res.send("not found")
                 }
                if(x){
                    if(c.department ===h.department){
                        x.courses.push(req.body.course_name)
                x.save()
                res.send("Done x")
                        }
                }
                else{
                    console.log("not found")
                    res.send("not found")
                }
            }
    })
   
    router.route("/HOD/delete_course_instructor")
    .put(auth,async (req,res,next)=>{
       
            const h = await Academic.findOne({
                id: decoded.id,
                type: "HOD"
            })

       
            if (h) {
                const x = await Academic.findOne({
                    id: req.body.id
                })
                 const c= await course.findOne({
                     name: req.body.course_name
            })
            if(c){
                if(c.department === h.department){
                c.instructors_ID= c.instructors_ID.filter(function(value){
                    return value!==req.body.id
                })
                c.save()
            }
            }
            else{
                console.log("not found")
                res.send("not found")
            }
                if(x){
                    if (c.department === h.department){
                x.courses= x.courses.filter(function(value){
                        return value!==req.body.course_name
                })
                x.save()
            }
            }
            else{
                console.log("not found")
                res.send("not found")
            }
            }
    })

    router.route("/HOD/view_staff")
    .get(auth,async(req,res,next)=>{

      
            const h = await Academic.findOne({
                id: decoded.id,
                type: "HOD"
            })
            if(h){
                const c= await course.findOne({
                    name: req.body.course_name
           })
           if(c){
               console.log("if")
               const res=c.instructors_ID.filter(function(value){
                   return c.department===h.department
               })
               const f=Academic.filter(function(value){
                  return res.includes(value.id)
               })

           }
           else{
               Academic.find({ department:h.department}).then(doc => {
                res.send(doc)
                }).catch(err => {
                    console.error(err)
                    }) 
           }
      }
 })
   
module.exports = router

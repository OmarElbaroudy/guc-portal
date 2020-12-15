const express = require("express");
const Academic = require("../models/academic");
const course = require("../models/course");
const jwt_decode = require('jwt-decode');
const requests = require("../models/requests");
const locations = require("../models/locations");
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
    .put(auth,async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);

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
                        x.courses.push({name:req.body.course_name,
                            position:"instructor"})
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
    .put(auth,async (req,res)=>{
            const token = req.header('auth-token')
            const decoded = jwt_decode(token);

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
                        return value.name!==req.body.course_name
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
    .post(auth,async(req,res)=>{
           const token = req.header('auth-token')
           const decoded = jwt_decode(token);
      
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
               const ress=c.instructors_ID.filter(function(){
                   return c.department===h.department
               })
              Academic.find({id: {$in: ress} }).then(doc => {
                res.send(doc)
                }).catch((err) => {
                    console.error(err)
                    }) 
           }
           else{
            console.log("else")
               Academic.find({ department:h.department}).then(doc => {
                res.send(doc)
                }).catch(err => {
                    console.error(err)
                    }) 
           }
      }
})
 router.route("/HOD/update_course_instructor")
     .put(auth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
         const h = await Academic.findOne({
             id: decoded.id,
             type: "HOD"
         })
         if(h){
            const x = await Academic.findOne({
                id: req.body.org_id
            })
            const y = await Academic.findOne({
                id: req.body.upd_id
            })
             const c= await course.findOne({
                     name: req.body.course_name
             })
             if(c){
                if(c.department === h.department){
                    const foundIndex = c.instructors_ID.findIndex(value => value === x.id);
                    console.log(foundIndex)
                    c.instructors_ID[foundIndex] = y.id;
              
                console.log(foundIndex)
            }   
            }
            const loc=new Array()
            x.Schedule=x.Schedule.filter(function(value){
                if(value.course === c.name)
                y.Schedule.push(value)
                return(value.course !== c.name )
            })
            for(var i=0;i<c.schedule.length;i++){
                if(c.schedule[i].instructor===x.id){
                    loc.push(c.schedule[i].location)
                    c.schedule[i].instructor=y.id
                }
            }
            console.log(c)
            c.save()
            const locs= await locations.find(
                { name: { $in: loc } }
             )
            for(var i=0;i<locs.length;i++){
                locs[i].schedule= locs[i].schedule.filter(function(value){
                    if(value.instructor===x.id && value.course === c.name)
                    value.instructor=y.id
                   return true
                })
                const filter = { name: locs[i].name };
                const update = { schedule:  locs[i].schedule};
   
                await locations.findOneAndUpdate(filter, update,{
                   new:true
               });
            }
            if(x){
                if (c.department === h.department){
            x.courses= x.courses.filter(function(value){
                    return value.name!==req.body.course_name
            })
            x.save()
        }
        }
        else{
            console.log("not found")
            res.send("not found")
        }
        if(y){
            if(c.department ===h.department){
                y.courses.push({name:req.body.course_name,
                position:"instructor"})
        y.save()
        res.send("Done y")
                }
        }
        else{
            console.log("not found")
            res.send("not found")
        }
           
   }
})
router.route("/HOD/view_day_off")  
    .post(auth,async(req,res)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);
    
     const h = await Academic.findOne({
         id: decoded.id,
         type: "HOD"
     })
     if(h){
        const s= await Academic.findOne({
            id: req.body.id
   })
   if(s){
        res.send(s.day_off)
   }
   else{
    Academic.find({}, {day_off:1,name:1, _id:1}).then(doc => {
        res.send(doc)
        }).catch(err => {
            console.error(err)
            }) 
   }
   }
     
}) 
router.route("/HOD/view_requests")
    .post(auth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        
         const h = await Academic.findOne({
             id: decoded.id,
             type: "HOD"
         })
         if(h){
            requests.find({ department:h.department}).then(doc => {
                res.send(doc)
                }).catch(err => {
                    console.error(err)
                    }) 
           }
})
router.route("/HOD/view_course_coverage")
    .post(auth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
         const h = await Academic.findOne({
             id: decoded.id,
             type: "HOD"
         })
         if(h){
            const c= await course.findOne({
                name: req.body.course_name
       })
       if(c){
           res.send((c.course_coverage).toString())
       }
         }
})
router.route("/HOD/view_course_schedule")
    .post(auth,async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
         const h = await Academic.findOne({
             id: decoded.id,
             type: "HOD"
         })
         if(h){
            const c= await course.findOne({
                name: req.body.course_name
       })
       if(c){
       if(c.department === h.department)
       res.send(c.schedule)
       }
         }
})
router.route("/HOD/accept_requests")
    .put(auth,async(req,res,next)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
         const h = await Academic.findOne({
             id: decoded.id,
             type: "HOD"
         })
         if(h){
             const request=await requests.findOne({
                request_ID: req.body.reqs_id
       })
       request.Status="accepted"
       request.save()
       if(request.type === "change day off"){

           const acad=await Academic.findOne({
            id: request.sender
      })

            acad.day_off=request.new_day_off
             acad.Schedule=acad.Schedule.filter(function(value){
                 return value.day!==acad.day_off
         })
        const c= await course.find(
            { name: { $in: acad.courses } }
         )
         const l=new Array(); 
         for(var i=0;i<c.length;i++){
             c[i].schedule=c[i].schedule.filter(function(value){
                 if(value.instructor===acad.id && value.day === acad.day_off)
                 l.push(value.location)
                 return (value.instructor!==acad.id && value.day !== acad.day_off)
              })
             const filter = { name: c[i].name };
             const update = { schedule:  c[i].schedule};
             await course.findOneAndUpdate(filter, update,{
                  new:true
              });
         }
         const locs= await locations.find(
            { name: { $in: l } }
         )
        
         for(var i=0;i<locs.length;i++){
             locs[i].schedule= locs[i].schedule.filter(function(value){
                return (value.instructor!==acad.id && value.day !== acad.day_off)
             })
             const filter = { name: locs[i].name };
             const update = { schedule:  locs[i].schedule};

             await locations.findOneAndUpdate(filter, update,{
                new:true
            });
         }
            request.Status="accepted"
            request.save()
            acad.save()
            res.send("changed successfully")
       }

         }

    })
 router.route("/HOD/reject_requests")
    .put(auth,async(req,res,next)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
   
         const h = await Academic.findOne({
             id: decoded.id,
             type: "HOD"
         })
         if(h){
             const request=await requests.findOne({
                request_ID: req.body.reqs_id
       })
       request.Status="rejected"
       request.save()
    }
    })
module.exports = router

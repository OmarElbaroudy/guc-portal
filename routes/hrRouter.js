const express = require("express");
const jwt_decode = require('jwt-decode');
const Academic = require("../models/academic");
const Location=require("../models/locations")
const Department=require("../models/department")
const Course=require("../models/course");
const Requests=require("../models/requests")
const { Router } = require("express");
const router = express.Router()

//4.4 HR
const auth = async (req, res, next) => {
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "hr") {
        const h = await HR.findOne({
            id: decoded.id
        })
        if (!h)
            return res.status(403).send("unauthorized access")
        next()
    }
}

router.route("/hr/location")
    .post(auth,async (req,res)=>{
        try{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        let t=req.body.type
        if(t=="lab" || t==" tutorial room" || t=="lecture hall" || t=="office"){
            const x=await Location.findOne({
                name:req.body.name
            })
            if(!x){
                let loc={
                    name:req.body.name,
                    capacity:req.body.capacity,
                    type:req.body.type
                }
                await Location.insertOne(loc);
            }
            else{
                res.status(403).send("Cannot use This location name as it already exists")
            }
        }
        else{
            res.send("location type should only be lab,tutorial room, lecture hall or office")
        }
        }
        catch(err){
            console.log(err)
        }
    })

    //update location
    .put(auth,async (req,res)=>{
        try{
            const token = req.header('auth-token')
            const decoded = jwt_decode(token);
            const vals = req.body;
            const x=await Location.findOne({
                name:req.body.name
            })
            if(x){
                let loc={}
                if(vals.capacity){
                    if(vals.capacity<x.currCapacity){
                        return res.status(403).send("Cannot update because the new capacity is less than the current capacity")
                    }
                    else{
                        loc.capacity=vals.capacity
                    }
                }
                if(vals.newName){
                    loc.name=vals.newName;
                }
                else{
                    loc.name=vals.name
                }
                if(vals.type){
                    loc.type=vals.type;
                }
                loc.schedule=x.schedule
                loc.currCapacity=x.currCapacity
                const temp=await Location.findOneAndUpdate({name:req.body.name},loc,{new:true})
                await temp.save()

                // do{
                // const u=await academic.findOneAndUpdate({office_location : name}, {office_location: newName},{new:true})
                // u.save()
                // }while(u);

                // for (let i = 0; i < x.schedule.length; i++){
                //     const co=await Course.findOne({name : x.schedule.course}) 
                //     for(let j=0;j<co.schedule.length;j++){
                //         if(co.schedule[j].location===req.body.oldName){
                //             co.schedule[j].location=req.body.newName
                //         }
                //     }
                //     co.save()
                //     const inst=await academic.findOne({name:x.schedule.instructor})
                //     for(let j=0;j<inst.schedule.length;j++){
                //         if(inst.schedule[j].location===req.body.oldName){
                //             inst.schedule[j].location=req.body.newName
                //         }
                //     }
               // }
            }
            else{
                res.status(403).send("this location does not exist")
            }
        }
        catch(err){
            console.log(err)
        }
    })

    router.route("/hr/deleteLocation")
        .delete(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const vals = req.body;
                const x=await Location.findOne({
                    name:req.body.name
                })
                const u=await Academic.findOne({officeLocationId : x._id})
                if(u || x.schedule.length!==0){
                    return res.status(403).send("cannot delete this location as it is occupied by an instructor/session")
                }
                else{   
                        const result= await Location.deleteOne({name :req.body.name})
                        res.send(result)
                    }
                }
            catch(err){
                console.log(err)
            }

        })

    router.route("/hr/registerMember")
        .post(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const vals = req.body;
                if((!req.body.id) || (!req.body.name)||(!req.body.salary)||(!req.body.officeLocation)||(!req.body.email)){
                    return res.status(403).send("each member should have name, salary, email, office location and id")
                }
                else{
                    const temp=Location.findOne({name:req.body.officeLocation})
                    if(!temp){
                        return res.status(403).send("this location does not exist")
                    }
                    if(temp.type!=="office"){
                        return res.status(403).send("this location is not an office")
                    }
                    if(temp.capacity==temp.currCapacity){
                        return res.status(403).send("this location is full")
                    }
                    const loc=await Location.findOne({name:req.body.officeLocation})
                    if(req.body.type==="hr"){
                        const x= await HR.insertOne({
                            name:req.body.name,
                            id:req.body.id,
                            officeLocation:loc._id,
                            email:req.body.email,
                            salary:req.body.salary,
                            dayOff:"Saturday",
                            personalInfo:req.body.personalInfo
                        })
                        await x.save()
                    }
                    if(req.body.type==="academic"){
                        const x= await Academic.insertOne({
                            name:req.body.name,
                            id:req.body.id,
                            office_location:loc._id,
                            email:req.body.email,
                            salary:req.body.salary,
                            dayOff:"Saturday",
                            personalInfo:req.body.personalInfo
                        })
                        await x.save()
                    }
                }
            }
            catch(err){
                console.log(err)
            }
        })

    Router.route("hr/addFaculty")
        .post(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const x=await Faculty.findOne({
                    name:req.body.name
                })
                if(!x){
                    await Faculty.insertOne({name:req.body.name})
                }
                else{
                    res.status(403).send("this faculty already exist")
                }

            }
            catch(err){
                console.log(err)
            }
    })

    Router.route("hr/updateFaculty")
        .put(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const x=await Faculty.findOne({
                    name:req.body.oldName
                })
                if(x){
                    await Faculty.findOneAndUpdate({name:req.body.name},{name:req.body.newName},{new:true})
                }
                else{
                    res.status(403).send("this faculty does not exist")
                }

            }
            catch(err){
                console.log(err)
            }
        })

        Router.route("hr/deleteFaculty")
        .delete(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const x=await Faculty.findOne({
                    name:req.body.name
                })
                if(x){
                    await Faculty.deleteOne({name:req.body.name})
                    const dep=await Department.findOne({
                        facultyId:x._id
                     })
                     while(dep){
                        const dep=await Department.findOneAndUpdate({facultyId:x._id},{facultyId:undefined},{new:true})
                        await dep.save()
                    }
                    }
                else{
                    res.status(403).send("this faculty does not exist")
                }

            }
            catch(err){
                console.log(err)
            }
        })

        Router.route("hr/addDepartment")
        .post(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const x=await Department.findOne({
                    name:req.body.name
                })
                if(!x){
                    if(!x.faculty){
                        await Department.insertOne({name:req.body.name})
                    }
                    else{
                        const f=await Faculty.findOne({name:req.body.faculty})
                        await Department.insertOne({name:req.body.name,facultyId:f._id})
                    }
                }
                else{
                    res.status(403).send("this department already exist")
                }

            }
            catch(err){
                console.log(err)
            }
    })

    Router.route("hr/updateDepartment")
        .put(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const x=await Department.findOne({
                    name:req.body.name
                })
                if(x){
                    if(req.body.newName){
                        x.name=req.body.newName
                    }
                    if(req.body.newFaculty){
                        const f=await Faculty.findOne({name:req.body.newFaculty})
                        x.facultyId.equals(f._id)
                    }
                    const d=await Department.insertOne({name:req.body.name},x,{new:true})

                    // else{
                    //     const f=await Faculty.findOne({name:req.body.faculty})
                    //     const d=await Department.insertOne({name:req.body.name},{name:req.body.newName,name:},{new:true})
                    // }
                }
                else{
                    res.status(403).send("this faculty does not exist")
                }

            }
            catch(err){
                console.log(err)
            }
        })

        Router.route("hr/deleteDepartment")
        .delete(auth,async (req,res)=>{
            //delete in course and academic
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const x=await Department.findOne({
                    name:req.body.name
                })
                if(x){
                    do{
                        const temp= await Course.findOneAndUpdate({departmentId:x._id},{departmentId:undefined},{new:true})
                    }while(!temp)

                    do{
                        const temp= await Academic.findOneAndUpdate({departmentId:x._id},{departmentId:undefined},{new:true})
                    }while(!temp)
                    await Department.findByIdAndDelete(x._id)


                }
            }
            catch(err){
                console.log(err)
            }
        })

        Router.Route("hr/addCourse")
            .post(async(req,res)=>{
                try{
                    const token = req.header('auth-token')
                    const decoded = jwt_decode(token);
                    const x=await Course.findOne({
                        name:req.body.name
                    })
                    if(x){
                        return res.status(403).send("this course already exist")
                    }
                    else{
                        if(!req.body.department){
                            return res.status(403).send("please enter a department")
                        }
                        else{
                            const d= await Department.findOne({name:req.body.department})
                            const c=Course.insertOne({
                                name:req.body.name,
                                departmentId: d._id,
                                facultyId:d.facultyId })
                            await c.save()
                        }
                    }
                }
                catch(err){
                    console.log(err)
                }

            })

            Router.route("hr/updateCourse")
            .put(async (req,res)=>{
                try{
                    const token = req.header('auth-token')
                    const decoded = jwt_decode(token);
                    const x=await Course.findOne({
                        name:req.body.name
                    })
                    if(!x){
                        return res.status(403).send("this course does not exist")
                    }
                    else{
                        if(req.body.department){
                            const d= await Department.findOne({name:req.body.department})
                            x.departmentId=d._id
                        }
                        if(req.body.newName){
                            x.name=req.body.newName
                        }
                        const c=await Course.findOneAndUpdate({name:req.body.name},x,{new:true})
                    }

                }
                catch(err){
                    console.log(err)
                }

            })

            Router.route("hr/deleteCourse")
            .delete(async (req,res)=>{
                try{
                    const token = req.header('auth-token')
                    const decoded = jwt_decode(token);
                    const x=await Course.findOne({
                        name:req.body.name
                    })
                    if(!x){
                        return res.status(403).send("this course does not exist")
                    }
                    else{//delete replacement requests for this course
                        const r=await Requests.find({type:"replacement"})
                        const temp=r.Filter(function(value){
                            return value.replacement.courseId.equals(x._id)
                        })
                        for(let i=0;i<temp.length;i++){
                            await Requests.findByIdAndDelete(temp[i]._id)
                        }

                        //delete slotLinking requests for this course
                        const r=await Requests.find({type:"slotLinking"})
                        const temp=r.filter(function(value){
                            return value.slotLinking.courseId.equals(x._id)
                        })
                        for(let i=0;i<temp.length;i++){
                            await Requests.findByIdAndDelete(temp[i]._id)
                        }

                        //delete this course from instructor and location schedules

                        for(let i=0;i<x.schedule.length;i++){
                            const loc=Location.findById(x.schedule[i].locationId)
                            for(let j=0;j<loc.schedule.length;j++){
                                loc.schedule=loc.schedule.filter(function(value){
                                    return !(value.courseId.equals(x._id))
                                })
                                await loc.save()

                            }
                            const inst=Academic.findById(x.schedule[i].instructorId)
                            for(let j=0;j<inst.schedule.length;j++){
                                inst.schedule=inst.schedule.filter(function(value){
                                    return !(value.courseId.equals(x._id))
                                })
                                await inst.save()
                            }
                        }
                        

                    
                }
            }
                catch(err){
                    console.log(err)
                }

            })

    
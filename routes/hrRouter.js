const express = require("express");
const jwt_decode = require('jwt-decode');
const Academic = require("../models/academic");
const Location=require("../models/locations")
const Department=require("../models/department")
const Course=require("../models/course");
const academic = require("../models/academic");
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
                name:req.body.oldName
            })
            if(x){
                let loc={}
                if(vals.capacity){
                    if(vals.capacity>x.currCapacity){
                        return res.status(403).send("Cannot update because the new capacity is more than the current capacity")
                    }
                    else{
                        loc.capacity=vals.capacity
                    }
                }
                if(vals.newName){
                    loc.name=vals.newName;
                }
                if(vals.type){
                    loc.type=vals.type;
                }
                loc.schedule=x.schedule
                loc.currCapacity=x.currCapacity
                x.save()

                do{
                const u=await academic.findOneAndUpdate({office_location : oldName}, {office_location: newName},{new:true})
                u.save()
                }while(u);

                for (let i = 0; i < x.schedule.length; i++){
                    const co=await Course.findOne({name : x.schedule.course}) 
                    for(let j=0;j<co.schedule.length;j++){
                        if(co.schedule[j].location===req.body.oldName){
                            co.schedule[j].location=req.body.newName
                        }
                    }
                    co.save()
                    const inst=await academic.findOne({name:x.schedule.instructor})
                    for(let j=0;j<inst.schedule.length;j++){
                        if(inst.schedule[j].location===req.body.oldName){
                            inst.schedule[j].location=req.body.newName
                        }
                    }
                }
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
        .put(auth,async (req,res)=>{
            try{
                const token = req.header('auth-token')
                const decoded = jwt_decode(token);
                const vals = req.body;
                const x=await Location.findOne({
                    name:req.body.name
                })
                const u=await academic.findOne({office_location : oldName})
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
                if((!req.body.id) || (!req.body.name)||(!req.body.salary)||(!req.body.office_location)||(!req.body.email)){
                    return res.status(403).send("each member should have name, salary, email, office location and id")
                }
                else{
                    const temp=Location.findOne({name:req.body.officeLocation})
                    if(!temp){
                        return res.status(403).send("this location does not exist")
                    }
                    if(temp.capacity==temp.currCapacity){
                        return res.status(403).send("this location is full")
                    }
                    if(req.body.type==="hr"){
                        const x= await HR.insertOne({
                            name:req.body.name,
                            id:req.body.id,
                            office_location:req.body.office_location,
                            email:req.body.email,
                            salary:req.body.salary,
                            dayOff:"Saturday",
                            personalInfo:req.body.personalInfo
                        })
                        x.save()
                    }
                    if(req.body.type==="academic"){
                        const x= await Academic.insertOne({
                            name:req.body.name,
                            id:req.body.id,
                            office_location:req.body.office_location,
                            email:req.body.email,
                            salary:req.body.salary,
                            personalInfo:req.body.personalInfo
                        })
                        x.save()
                    }
                }
            }
            catch(err){
                console.log(err)
            }
        })

    
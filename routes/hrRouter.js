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
                name:req.body.name
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
                for (let i = 0; i < x.schedule.length; i++){
                    const co=await Course.findOne({name : x.schedule.course}) 
                    for(let j=0;j<co.schedule.length;j++){
                        if(co.schedule[j].location===req.params.oldName){
                            co.schedule[j].location=req.params.newName
                        }
                    }
                    co.save()
                    const inst=await academic.findOne({name:x.schedule.instructor})
                    for(let j=0;j<inst.schedule.length;j++){
                        if(inst.schedule[j].location===req.params.oldName){
                            inst.schedule[j].location=req.params.newName
                        }
                    }
                    
                    if(inst.officeLocation===req.params.oldName){
                        inst.officeLocation=req.params.newName
                    }
                    inst.save()

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


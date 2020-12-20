const express = require("express");
const jwt_decode = require('jwt-decode');
const Academic = require("../models/academic");
const Location=require("../models/locations")
const Department=require("../models/department")
const Course=require("../models/course")
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
        let t=req.params.type
        if(t=="lab" || t==" tutorial room" || t=="lecture hall" || t=="office"){
            const x=await Location.findOne({
                name:req.params.name
            })
            if(!x){
                let loc={
                    name:req.params.name,
                    capacity:req.params.capacity,
                    type:req.params.type
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
    // .put(auth,async (req,res)=>{
    //     try{
    //         const token = req.header('auth-token')
    //         const decoded = jwt_decode(token);
    //         const vals = req.body;
    //         const x=await Location.findOne({
    //             name:req.params.name
    //         })
    //         if(x){
    //             let loc={}
    //             if(vals.name){
    //                 loc.name=vals.name;
    //             }
    //             if(vals.type){
    //                 loc.type=vals.type;
    //             }
    //             if(vals.capacity){
    //                 if(vals.capacity>)
    //             }

    //         }
    //         else{
    //             res.status(403).send("this location does not exist")
    //         }
    //     }
    //     catch(err){
    //         console.log(err)
    //     }
    // })


const express = require("express");
const Academic = require("../models/academic");
const HR=require("../models/HR")
const jwt_decode = require('jwt-decode');
const router = express.Router()

router.route("/myProfile")
    .get(async (req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        if(decoded.type=="hr"){
            const h=await HR.findOne({
                id=decoded.id
            })
            res.send(h)
        }
        else{
            const a=await Academic.findOne({
                id=decoded.id
            })
            res.send(a)
        }   
    })

    //update profile
    .put(async(req,res)=>{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        if(decoded.type=="hr"){
            try{
                const temp= await Academic.findOne({id : decoded.id})
                if((temp.id!=req.body.id) || (temp.name!=req.body.name)){
                    return res.status("403").send("cannot update name or id")
                }
                const result= await Academic.findOneAndUpdate({id :
                decoded.id}, req.body, {new: true})
                 res.send(result)
                 }
                 catch(err){
                 console.log(err)
                 }
        }
        else{
            try{
                //NOT COMPLETE
                const temp= await Academic.findOne({id : decoded.id})
                if((temp.id!=req.body.id) || (temp.name!=req.body.name) || (temp.salary!=req.body.salary) || (temp.faculty!=req.body.faculty) || (temp.department!=req.body.department)){
                    return res.status("403").send("cannot update name, id, salary, faculty or department as an academic member")
                }
                const result= await Academic.findOneAndUpdate({id :
                decoded.id}, req.body, {new: true})
                 res.send(result)
                 }
                 catch(err){
                 console.log(err)
                 }
        }
    })


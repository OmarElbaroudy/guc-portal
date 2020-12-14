const express = require("express");
const Academic = require("../models/academic");
const course = require("../models/course");
const jwt_decode = require('jwt-decode');
const academic = require("../models/academic");
const Requests = require("../models/requests")
const router = express.Router()

 //4.4 Academic Member
 const auth= async (req,res,next)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "academic") {
        const ac = await Academic.findOne({
            id: decoded.id
        })
        if(!ac)
        return res.status(403).send("unauthorized access")
        next()
  }
}
router.route("/ac/viewSchedule")
.get(auth,async (req,res)=>{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);
    const ac = await Academic.findOne({
        id: decoded.id
    })
    res.send(ac.Schedule) //should have replacements if present
})

router.route("/ac/ReplacementRequest")
.post(auth,async(req,res)=>{
    try{
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        if (decoded.type === "academic") {
            const ac = await Academic.findOne({
                id: decoded.id
            })
        }      
        if (ac){
        const ac2 = await Academic.findOne({
            id: req.body.id
        })
            if(ac2 && !(ac===ac2) ){
                Requests.insertOne() //sender ac, reciever ac2
            }
    }
    }
    catch(err){
        console.log(err)
    }
})

.get(auth,async(req,res)=>{
    try{
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);
    let response =[]
    const reqs = await Requests.find({
        sender : decoded.id,
        type : "Replacement"
    })
    response.push(reqs)
    const reqs2 = await Requests.find({
        reciever : decoded.id,
        type : "Replacement"
    })
    response.push(reqs2)
    res.send(response)
    }
    catch(err){
        console.log(err)
    }
})
module.exports=router
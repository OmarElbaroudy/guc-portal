const express=require("express");
const academic = require("../models/academic");
const router = express.Router();

router.route("HOD/assign_course_instructor")
.put(async (req,res)=>{
    const token=req.header.token
    if(token.type=="academic")
     const h=await academic.findOne({
         id:token.id,
         type:"HOD"
     })
     if(h){
         academic.update(
            { id:h.id},
            {$push :{courses:req.body.course}}
         )
     }

})
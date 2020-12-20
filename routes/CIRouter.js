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
            type: "CI"
        })
        if(!h)
        return res.status(403).send("unauthorized access")

        next()
  }
}
    router.route("/CI/view_assigned_slots")
    .get(auth,async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        let response = [] ;


        const h = await Academic.findOne({
            id: decoded.id,
            type: "CI"
        })
         for (const entry of h.courses) {
            const x = await course.findOne({
                name : entry
            })
            if(x){
                 response.push(x.schedule)
            }

          }
        
           res.send(response)
           
    })

module.exports = router

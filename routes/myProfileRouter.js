const express = require("express")
const bcrypt = require('bcryptjs')
const jwt_decode = require('jwt-decode')

const Academic = require("../models/academic")
const HR = require("../models/HR")

const router = express.Router()


router.route("/myProfile")
    .get(async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        try{
            if (decoded.type === "hr") {
                const h = await HR.findOne({
                    id: decoded.id
                })
                return res.send(h)
            }
            const a = await Academic.findOne({
                id: decoded.id
            })
            return res.send(a)
        }catch (err) {
            console.log(err)

        }
    })
    .put(async (req, res) => {
        const token = req.header('auth-token');
        const decoded = jwt_decode(token);
        const salt = await bcrypt.genSalt(10);
        const vals = req.body;
        try {
                let doc = {};

                if(vals.gender === "male" || vals.gender === "female"){
                    doc.gender = vals.gender;
                }

                if(vals.password){
                    doc.password = await bcrypt.hash(vals.password,salt);
                }

                if(vals.personalInfo){
                    doc.personalInfo = vals.personalInfo;
                 }

                if(decoded.type === "hr"){
                    if(vals.office_location){
                        doc.office_location = vals.office_location;
                    }

                    if(vals.salary){
                        doc.salary = vals.salary;
                    }
                }

                const cur = await Academic.findOneAndUpdate(
                    {id: decoded.id }, doc, {new: true});

                res.send(cur);
            } catch (err) {
                console.log(err)
            }
    })

module.exports = router;

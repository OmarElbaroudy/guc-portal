const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Academic = require('./models/academic.js')
const HR = require('./models/HR.js')
const course = require('./models/course.js')
const faculty = require('./models/faculty.js')
const request = require('./models/requests.js')
const department = require('./models/department.js')
const location = require('./models/locations.js')
const CIRouter = require('./routes/CIRouter')
const HODRouter=require('./routes/HODRouter')
const AcademicMember=require('./routes/acRouter')
const key = 'iehfoeihfpwhoqhfiu083028430bvf'

const app = express()
app.use(express.json())

const cluster = 'mongodb+srv://admin:admin@cluster0.ryozj.mongodb.net/Proj?retryWrites=true&w=majority';

mongoose.connect(cluster, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {

        app.post('/login', async (req, res) => {
            const email = req.body.email;
            const h = await HR.findOne({email: email})
            const a = await Academic.findOne({email: email})

            if (!h && !a) {
                return res.status(403).send("This email doesn't exist");
            }

            const user = h !== null ? h : a;
            //const verified = await bcrypt.compare(req.body.password, user.password)
            const verified = (user.password ===req.body.password)
            if (!verified) {
                return res.status(403).send("wrong password")
            }

            const payload = {id: user.id, type: h !== null ? "hr" : "academic"}
            const token = jwt.sign(payload, key)

            res.header('auth-token', token)
            res.send("login successfull")
        })

        function authenticate(req, res, next) {
            if (!req.header('auth-token')) {
                return res.status(403).send("unauthorized access")
            }

            try {
                jwt.verify(req.header('auth-token'), key)
                next()
            } catch (err) {
                res.status(403).send("invalid token")
            }
        }

       
        app.use(authenticate)
        app.use("", CIRouter)
        app.use("", HODRouter)
        app.use("",AcademicMember)


        app.listen(3000, () => {
            console.log("connected")
        })
    }).catch((err) => {
    console.log(err)
})
//localhost:3000/HOD/assign_course_instructor/
// {
//     "email" :  "x@x",
//     "password" : "123456",
//     "course" : "omar"
//
// }

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTEiLCJ0eXBlIjoiYWNhZGVtaWMiLCJpYXQiOjE2MDc4OTIyODN9.IHNSqzO3R9PJuw1Tg6BEHCPVW6FQAgIp72vEfy2SeOY


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNhZGVtaWMiLCJpYXQiOjE2MDc5NTM2NzJ9.zrY1kNdnz0_hGXcm-AF03x6tc0vU_Qp0qv3Rm-8kqBE

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjLTMiLCJ0eXBlIjoiYWNhZGVtaWMiLCJpYXQiOjE2MDc5NjE1MDJ9.WUofsgXIjLfe1ZDksOpG6B8L6py4cuvNe3XP7PwMLvw
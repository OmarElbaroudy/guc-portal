const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Academic = require('./models/academic.js')
const HR = require('./models/HR.js')
const course = require('./models/course.js')
const faculty = require('./models/faculty.js')
const request = require('./models/requests.js')
const department = require('./models/department.js')
const location = require('./models/locations.js')

const HODRouter=require('./routes/HODRouter')
const AcademicMember=require('./routes/acRouter')
const loginRouter = require('./routes/loginRouter')
const myProfileRouter = require('./routes/myProfileRouter')
const CIRouter = require('./routes/CIRouter')

const key = 'iehfoeihfpwhoqhfiu083028430bvf'

const app = express()
app.use(express.json())

const cluster = 'mongodb+srv://admin:admin@cluster0.ryozj.mongodb.net/Proj?retryWrites=true&w=majority';
mongoose.connect(cluster, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {

        function authenticate(req, res, next) {
            if (!req.header('auth-token')) {
                return res.status(403).send("unauthorized access")
            }

            try {
                jwt.verify(req.header('auth-token'), key)
                next()
            } catch (err) {
                res.status(401).send("invalid token")
            }
        }

        app.use(authenticate)
        app.use("", CIRouter)
        app.use("", HODRouter)
        app.use("",AcademicMember)
        app.use("", loginRouter);
        app.use("", myProfileRouter);

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

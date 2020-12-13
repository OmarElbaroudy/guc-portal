const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Academic = require('./models/academic.js')
const HR = require('./models/HR.js')
const course = require('./models/course.js')
const faculty = require('./models/faculty.js')
const department = require('./models/department.js')
const location = require('./models/locations.js')


const app = express()
const key = 'iehfoeihfpwhoqhfiu083028430bvf'

const cluster = 'mongodb+srv://admin:admin@cluster0.ryozj.mongodb.net/Proj?retryWrites=true&w=majority';

mongoose.connect(cluster, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        app.use(express.json())
        app.post('/login', async (req, res) => {
            const email = req.body.email;
            const h = await HR.findOne({email: email})
            const a = await Academic.findOne({email: email})

            if (!h && !a) {
                return res.status(403).send("This email doesn't exist");
            }

            const user = h ? h : a;
            const verified = await bcrypt.compare(req.body.password, user.password)

            if (!verified) {
                return res.status(403).send("wrong password")
            }

            const payload = {id: user.id, type: h ? "hr" : "academic"}
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
        app.listen(3000, () => {
            console.log("connected")
        })
    }).catch((err) => {
    console.log(err)
})

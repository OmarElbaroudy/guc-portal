const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Academic = require('./academic.js')
const HR = require('./HR.js')
const course = require('./course.js')
const faculty = require('./faculty.js')
const department = require('./department.js')
const location = require('./locations.js')


const app = express()
const key = 'iehfoeihfpwhoqhfiu083028430bvf'

const cluster = 'mongodb+srv://admin:admin@cluster0.ryozj.mongodb.net/Proj?retryWrites=true&w=majority';

mongoose.connect(cluster, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        app.use(express.json())

        function authenticate(req, res, next) {
            if (!req.header('auth-token')) {
                return res.status(403).send("el token ya 7aramy")
            }
            try {
                jwt.verify(req.header('auth-token'), key)
                next()
            } catch (err) {
                res.status(403).send("el token msh beta3ak")
            }
        }

        app.use(authenticate)
        app.listen(3000, () => {
            console.log("connected")
        })
    }).catch((err) => {
    console.log(err)
})

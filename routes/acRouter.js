const express = require("express");
const jwt_decode = require('jwt-decode');
const Academic = require("../models/academic");
const Requests = require("../models/requests")
const router = express.Router()

//4.4 Academic Member
const auth = async (req, res, next) => {
    const token = req.header('auth-token')
    const decoded = jwt_decode(token);

    if (decoded.type === "academic") {
        const ac = await Academic.findOne({
            id: decoded.id
        })
        if (!ac)
            return res.status(403).send("unauthorized access")
        next()
    }
}
router.route("/ac/viewSchedule")
    .get(auth, async (req, res) => {
        const token = req.header('auth-token')
        const decoded = jwt_decode(token);
        const cur = await Academic.findOne({
            id: decoded.id
        })
        res.send(cur.Schedule) //should have replacements if present
    })

router.route("/ac/ReplacementRequest")
    .post(auth, async (req, res) => {
        try {
            const token = req.header('auth-token')
            const decoded = jwt_decode(token);
            const val = req.body; //id receiver, slot, location, day, course

            const sender = await Academic.findOne({
                id: decoded.id
            })

            const receiver = await Academic.findOne({
                id: val.id
            })

            if (!receiver) return res.status(405).send("invalid receiver id")

            let fst = false;
            sender.courses.forEach((item) => {
                fst |= item === val.course;
            })

            let snd = false;
            receiver.courses.forEach((item) => {
                snd |= item === val.course;
            })

            if (!fst || !snd) return res.status(406).send("invalid course")

            let flag = false;
            sender.Schedule.forEach((item) => {
                flag |= item.day === val.day && item.course === val.course && item.slot === val.slot;
            })

            if (!flag) return res.status(407).send("invalid slot")

            let Request = {
                Status: "pending",
                type: "Replacement",
                department: sender.department,
                sender: sender.id,
                receiver: receiver.id,
                course: val.course,
                slot: val.slot,
                location: val.location,
                day: val.day
            }

            await Requests.insertOne(Request);
            let arr = await Requests.find(Request).toArray();

            const lst = arr[arr.length - 1];

             sender.sent_requests.push(lst._id);
             receiver.received_requests.push(lst._id);

             sender.save();
             receiver.save();

        } catch (err) {
            console.log(err)
        }
    })

    .get(auth, async (req, res) => {
        try {
            const token = req.header('auth-token')
            const decoded = jwt_decode(token);
            let response = []
            const reqs = await Requests.find({
                sender: decoded.id,
                type: "Replacement"
            })
            response.push(reqs)
            const reqs2 = await Requests.find({
                receiver: decoded.id,
                type: "Replacement"
            })
            
            response.push(reqs2)
            res.send(response)
        } catch (err) {
            console.log(err)
        }
    })

module.exports = router

const express = require("express");
const bcrypt = require("bcryptjs");
const hr = require("../models/hr");
const jwt = require("jsonwebtoken");
const requests = require("../models/requests");
const academic = require("../models/academic");
const timeCalculations = require("../components/timeCalculations");

const router = express.Router();
const calc = new timeCalculations();
const key = "iehfoeihfpwhoqhfiu083028430bvf";

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const h = await hr.findOne({ email: email });
  const a = await academic.findOne({ email: email });
  if (!h && !a) {
    return res.status(408).json("This email doesn't exist");
  }

  let user = h !== null ? h : a;
  const verified = await bcrypt.compare(req.body.password, user.password);
  if (!verified) {
    return res.status(409).json("wrong password");
  }

  const payload = { id: user._id, type: h !== null ? "hr" : "academic" };
  const token = jwt.sign(payload, key);

  calc.update(user);
  user.missingHours = await calc.calculateMissingHours(user);
  user.missingDays = await calc.calculateMissingDays(user);
  await user.save();

  res.header("auth-token", token);
  const t = h !== null ? "hr" : "academic";
  return res.status(201).json({
    token: token,
    message: "login successful",
    user: user,
    type: t,
  });
});

router.get("/createHr", async (req, res) => {
  const a = await academic.find();
  const h = await hr.find();
  if (a.length === 0 && h.length === 0) {
    const cur = new hr({
      name: "Ashry",
      email: "ashry@gmail.com",
      id: "hr-1",
      password: await bcrypt.hash("123456", await bcrypt.genSalt(10)),
      gender: "male",
      salary: "5000",
      dayOff: 6,
    });

    await cur.save();

    return res.json("email:ashry@gmail.com, password:123456");
  } else {
    return res.json("the data base contains at least a user");
  }
});

module.exports = router;

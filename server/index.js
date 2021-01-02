const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const hodRouter = require("./routes/hodRouter");
const academicRouter = require("./routes/academicRouter");
const loginRouter = require("./routes/loginRouter");
const logoutRouter = require("./routes/logoutRouter");
const staffRouter = require("./routes/staffRouter");
const hrRouter = require("./routes/hrRouter");
const instructorRouter = require("./routes/instructorRouter");
const coordinatorRouter = require("./routes/coordinatorRouter");

const hrs = require("./models/hr");

const key = "iehfoeihfpwhoqhfiu083028430bvf";

const app = express();
app.use(express.json());
app.use(cors());

const loadTokens = async function () {
  try {
    let data = fs.readFileSync("blackList.json");
    let dataString = data.toString();
    return await JSON.parse(dataString);
  } catch (error) {
    return [];
  }
};

const validToken = function (arr, token) {
  return !arr.includes(token);
};

const cluster =
  "mongodb+srv://admin:admin@cluster0.ryozj.mongodb.net/Proj?retryWrites=true&w=majority";
mongoose
  .connect(cluster, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    async function authenticate(req, res, next) {
      try {
        if (!req.header("auth-token")) {
          return res.status(403).send("unauthenticated access");
        }

        jwt.verify(req.header("auth-token"), key);
        if (!validToken(await loadTokens(), req.header("auth-token"))) {
          return res
            .status(450)
            .send("this token is blackListed please login again");
        }
        next();
      } catch (err) {
        res.status(401).send("invalid token");
      }
    }

    app.get("/createHr", async (req, res) => {
      const hr = new hrs({
        name: "Ashry1",
        email: "ashry1@gmail.com",
        password: await bcrypt.hash("123456", await bcrypt.genSalt(10)),
        gender: "male",
        salary: "5000",
        dayOff: 6,
      });

      await hr.save();
      res.send("hr added successfully");
    });

    app.use("", loginRouter);
    app.use(authenticate);
    app.use("", hrRouter);
    app.use("", hodRouter);
    app.use("", staffRouter);
    app.use("", logoutRouter);
    app.use("", academicRouter);
    app.use("", instructorRouter);
    app.use("", coordinatorRouter);

    app.listen(3000, () => {
      console.log("connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const hrRouter = require("./routes/hrRouter");
const hodRouter = require("./routes/hodRouter");
const loginRouter = require("./routes/loginRouter");
const staffRouter = require("./routes/staffRouter");
const logoutRouter = require("./routes/logoutRouter");
const getterRouter = require("./routes/getterRouter");
const academicRouter = require("./routes/academicRouter");
const instructorRouter = require("./routes/instructorRouter");
const coordinatorRouter = require("./routes/coordinatorRouter");
const key = "iehfoeihfpwhoqhfiu083028430bvf";
const port = process.env.PORT || 5000;

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

		if (
			process.env.NODE_ENV === "production" ||
			process.env.NODE_ENV === "staging"
		) {
			app.use(express.static("client/build"));
			app.get("*", (req, res) => {
				res.sendFile(path.join(__dirname + "/client/build/index.html"));
			});
		}

		app.use("", loginRouter);
		app.use(authenticate);
		app.use("", hrRouter);
		app.use("", hodRouter);
		app.use("", staffRouter);
		app.use("", getterRouter);
		app.use("", logoutRouter);
		app.use("", academicRouter);
		app.use("", instructorRouter);
		app.use("", coordinatorRouter);

		app.listen(port, () => {
			console.log("connected");
		});
	})
	.catch((err) => {
		console.log(err);
	});

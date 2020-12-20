const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const hodRouter = require("./routes/hodRouter");
const academicRouter = require("./routes/academicRouter");
const loginRouter = require("./routes/loginRouter");
const staffRouter = require("./routes/staffRouter");
const hrRouter = require("./routes/hrRouter");
const instructorRouter = require("./routes/instructorRouter");
const coordinatorRouter = require("./routes/coordinatorRouter");

const key = "iehfoeihfpwhoqhfiu083028430bvf";

const app = express();
app.use(express.json());

const cluster =
	"mongodb+srv://admin:admin@cluster0.ryozj.mongodb.net/Proj?retryWrites=true&w=majority";
mongoose
	.connect(cluster, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		function authenticate(req, res, next) {
			if (!req.header("auth-token")) {
				return res.status(403).send("unauthenticated access");
			}

			try {
				jwt.verify(req.header("auth-token"), key);
				next();
			} catch (err) {
				res.status(401).send("invalid token");
			}
		}

		app.use("", loginRouter);
		app.use(authenticate);
		app.use("", hrRouter);
		app.use("", hodRouter);
		app.use("", staffRouter);
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

//TODO:
//logout

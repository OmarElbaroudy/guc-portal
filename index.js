const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require('dotenv').config()

const hrRouter = require("./routes/hrRouter");
const hodRouter = require("./routes/hodRouter");
const loginRouter = require("./routes/loginRouter");
const staffRouter = require("./routes/staffRouter");
const logoutRouter = require("./routes/logoutRouter");
const getterRouter = require("./routes/getterRouter");
const academicRouter = require("./routes/academicRouter");
const instructorRouter = require("./routes/instructorRouter");
const coordinatorRouter = require("./routes/coordinatorRouter");
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());

const cluster =process.env.DB_URL;
mongoose
	.connect(cluster, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		if (
			process.env.NODE_ENV === "production" ||
			process.env.NODE_ENV === "staging"
		) {
			app.use(express.static("client/build"));
		}

		app.use("", loginRouter);
		app.use("", hrRouter);
		app.use("", hodRouter);
		app.use("", staffRouter);
		app.use("", getterRouter);
		app.use("", logoutRouter);
		app.use("", academicRouter);
		app.use("", instructorRouter);
		app.use("", coordinatorRouter);

		if (
			process.env.NODE_ENV === "production" ||
			process.env.NODE_ENV === "staging"
		) {
			app.get("*", (req, res) => {
				res.sendFile(path.join(__dirname + "/client/build/index.html"));
			});
		}

		app.listen(port, () => {
			console.log("connected");
		});
	})
	.catch((err) => {
		console.log(err);
	});

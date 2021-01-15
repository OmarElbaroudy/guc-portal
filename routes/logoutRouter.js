const fs = require("fs");
const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const key = "iehfoeihfpwhoqhfiu083028430bvf";

const blackListToken = function (arr, token) {
  arr.push(token);
  fs.writeFileSync("./blackList.json", JSON.stringify(arr));
};


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

const auth = async (req, res, next) => {
	if (!req.header("auth-token")) {
		return res.status(403).send("unauthenticated access");
	}

	jwt.verify(req.header("auth-token"), key);
	if (!validToken(await loadTokens(), req.header("auth-token"))) {
		return res.status(450).send("this token is blackListed please login again");
	}
	next();
};

router.get("/api/logout",auth, async (req, res) => {
  try {
    blackListToken(await loadTokens(), req.header("auth-token"));
    res.json("logged out successfully");
  } catch (err) {
    res
      .status(401)
      .json("invalid token you need to be loggedIn in order to logout");
  }
});

module.exports = router;

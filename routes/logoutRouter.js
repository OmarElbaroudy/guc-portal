const fs = require("fs");
const express = require("express");
const router = express.Router();

const blackListToken = function (arr, token) {
  arr.push(token);
  fs.writeFileSync("./blackList.json", JSON.stringify(arr));
};

const loadTokens = async function () {
  try {
    let data = fs.readFileSync("./blackList.json");
    let dataString = data.toString();
    return await JSON.parse(dataString);
  } catch (error) {
    return [];
  }
};

router.get("/logout", async (req, res) => {
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

"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
	API_ADDR: "\"http://localhost:3001/api\"",
	NODE_ENV: "\"development\"",
});

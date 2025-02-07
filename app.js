require("dotenv").config();
require("./src/config/database").connect();
const express = require("express");

const app = express();
app.use(express.json());
// logic goes here

module.exports = app;

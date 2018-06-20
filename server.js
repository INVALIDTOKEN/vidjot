"use strict";

require("./mongooseSetup/mongoooseSetup.js");
const mongoose = require("mongoose");
const express = require("express");
const { bodyParser } = require("./bodyParser.js");
const { RegisterUserModel } = require("./mongooseModel/RegisterUserModel.js");
const { createUser } = require("./mongooseDocument/registerUserDoc.js");
const { createIdea } = require("./mongooseDocument/ideaDoc");
const pug = require("pug");
const app = express();
const port = 3000;
const hostName = "127.0.0.1";

// SETTING A TEMPLATE ENGINE
app.set("view engine", "pug");
app.set("views", "./views");

// Parsing the request payload
app.use("/", bodyParser);

// STATIC SERVER
app.use("/static", express.static("./public"));

app.get("/", (request, response)=>{
  response.render("_home");
});

app.get("/about", (request, response)=>{
  response.render("_about");
});

// ROUTES FOR LOGINING IN

app.get("/login", (request, response, next)=>{
  response.render("_login");
});

// ROUTES FOR REGISTERING A USER

app.get("/register", (request, response)=>{
  response.render("_register");
});

app.post("/register/submit", (request, response)=>{
  console.log(request.body);
  let newUser = createUser(request.body);
  response.send(newUser);
});

// ROUTES FOR ADDING IDEA 
app.get("/ideas/add", (request, response)=>{
  response.render("_addIdea", {loggedIn : true});
});

app.post("/ideas/add", (request, response)=>{
  console.log(request.body);
  response.redirect("/ideas");
});

// RENDER ALL THE IDEAS
app.get("/ideas", (request, response)=>{
  response.render("_Ideas");
});

app.listen(port, hostName, ()=>{
  console.log(`Server running at ${hostName}:${port}`);
});




// THINGS TO START WITH 
  // Make the mongoose registerUserModel work with proper validation
  // Make sure to validate both the user agent and the server
  // Use a hasing module to store the hash password
  // See what are express global variables
  // Use passport for login route




































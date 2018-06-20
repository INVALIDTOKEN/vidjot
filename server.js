"use strict";

require("./mongooseSetup/mongoooseSetup.js");
require("./passportConfig/passportConfig.js");
const mongoose = require("mongoose");
const express = require("express");
const { bodyParser } = require("./bodyParser.js");
const { RegisterUserModel } = require("./mongooseModel/RegisterUserModel.js");
const { createUser } = require("./mongooseDocument/registerUserDoc.js");
const { createIdea } = require("./mongooseDocument/ideaDoc");
const querystring = require("querystring");
const pug = require("pug");
const app = express();
const port = 3000;
const hostName = "127.0.0.1";
const passport = require("passport");

app.use((request, response, next)=>{
  if(typeof request.headers.cookie !== undefined){
    request.cookies = querystring.parse(request.headers.cookie);
    next();
  }else{
    next();
  }
});

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

app.post("/login", passport.authenticate("local", {
  failureRedirect : "/login",
  successRedirect : "/ideas"
}));

// ROUTES FOR REGISTERING A USER

app.get("/register", (request, response)=>{
  response.render("_register");
});

app.post("/register/submit", (request, response)=>{
  console.log(request.body);
  let newUser = createUser(request.body);
  newUser.save()
  .then((result) => {

    // [TODO] HAVE TO ADD A FLASH MSG HERE
    response.redirect("/login"); 

  }).catch((err) => {
    // [TODO] HAVE TO ADD A FLASH MSG HERE

    // When ever there is a problem in registering re-render the "/register" route.
    response.redirect("/register");
  });
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




































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
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const pug = require("pug");
const app = express();
const port = 3000;
const hostName = "127.0.0.1";
const passport = require("passport");

app.use(
  cookieSession(
    {
      maxAge : 24*60*60*1000,
      keys : ["Secret"]
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

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
  if(request.cookies.flashMessage){
    let flash = JSON.parse(request.cookies.flashMessage);
    response.clearCookie("flashMessage");
    return response.render("_login", { flash });
  }
  response.render("_login");
});

app.post("/login", passport.authenticate("local"), (request, response)=>{
  response.redirect("/ideas");
});

// ROUTES FOR REGISTERING A USER

app.get("/register", (request, response)=>{
  if(request.cookies.flashMessage){
    let flash = JSON.parse(request.cookies.flashMessage);
    response.clearCookie("flashMessage");
    return response.render("_register", { flash });
  }
  response.render("_register");
});

app.post("/register/submit", (request, response)=>{
  console.log(request.body);
  let newUser = createUser(request.body);
  newUser.save()
  .then((result) => {

    // [TODO] HAVE TO ADD A FLASH MSG HERE
    let flashInfo = {
      registered : true,
      message : "You have been registered now you can login using the same email and password",
      type : "success",
      setBy : "/register/submit"
    };
    response.cookie("flashMessage", JSON.stringify(flashInfo));
    response.redirect("/login"); 

  }).catch((err) => {
    // [TODO] HAVE TO ADD A FLASH MSG HERE

    // When ever there is a problem in registering re-render the "/register" route.
    let flashInfo = {
      registered : false,
      message : "Sorry we have touble in registering you in please follow the correct details.",
      type : "danger",
      setBy : "/register/submit"
    };
    response.cookie("flashMessage", JSON.stringify(flashInfo));
    response.redirect("/register");
  });
});

// ROUTES FOR ADDING IDEA 
app.get("/ideas/add", (request, response)=>{
  if(request.user){
    return response.render("_addIdea", {loggedIn : true});
  }

  // [TODO] HAVE TO ADD A FLASH MSG HERE
  response.redirect("/login");
});

app.post("/ideas/add", (request, response)=>{
  console.log(request.body);
  response.redirect("/ideas");
});

// RENDER ALL THE IDEAS
app.get("/ideas", (request, response)=>{
  if(request.user){
    return response.render("_Ideas", {loggedIn : true});
  }
  // [TODO] HAVE TO ADD A FLASH MSG HERE
  response.redirect("/login");
});

app.listen(port, hostName, ()=>{
  console.log(`Server running at ${hostName}:${port}`);
});




// THINGS TO START WITH 
  // Flash messages
  // registerUserModel server validation
  // Make sure to validate both the user agent and the server
  // Use a hasing module to store the hash password
  // See what are express global variables




































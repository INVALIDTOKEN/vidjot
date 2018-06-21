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
const flash = require("connect-flash");
const pug = require("pug");
const app = express();
const port = 3000;
const hostName = "127.0.0.1";
const passport = require("passport");

const flashMessage = function(message, type){
  return JSON.stringify({ message , type });
}

const isAuthenticated = function(request, property){
  return (request.user !== "undefined");
}

app.use(
  cookieSession(
    {
      maxAge : 24*60*60*1000,
      keys : ["kitty kat"]
    }
  )
);

app.use(flash());
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
  // IF USER IS LOGGEDIN DON'T SHOW
  if(request.user){
    response.cookie("flashMessage", flashMessage("You have already logged in no need to log in again.", "info"));
    return response.redirect("/ideas");
  }

  // FLASH MESSAGE DEFINED BY PASSPORT
  let pFlash = request.flash("error")[0];

  // FLASH MESSAGE DEFINED BY ME
  let flashInfo = request.cookies.flashMessage;

  if(typeof flashInfo  !== "undefined"){

    flashInfo = JSON.parse(flashInfo);
    response.clearCookie("flashMessage");
    return response.render("_login", { flash : flashInfo });

  }else if(pFlash !== undefined){

    let flashInfo = JSON.parse(pFlash);
    return response.render("_login", { flash : flashInfo });

  }
  response.render("_login");
});

app.post("/login", passport.authenticate("local", {
  failureRedirect : "/login",
  failureFlash : true
}),  (request, response)=>{
  response.redirect("/ideas");
});

// ROUTES FOR REGISTERING A USER
app.get("/register", (request, response)=>{
  let flashInfo = request.cookies.flashMessage;
  if(typeof flashInfo !== "undefined"){
    let flash = JSON.parse(flashInfo);
    response.clearCookie("flashMessage");
    return response.render("_register", { flash });
  }
  response.render("_register");
});


// [TODO] MAKE AN INSTANCE METHOD FOR STORING THE DOCUMENT
app.post("/register/submit", (request, response)=>{
  console.log(request.body);
  let newUser = createUser(request.body);
  newUser.save()
  .then((result) => {

    // [COMPLETE] FLASH MSG IS DONE
    response.cookie("flashMessage", flashMessage("You have been registered now you can login using the same email and password", "success"));
    response.redirect("/login"); 

  }).catch((err) => {
    // [COMPLETE] FLASH MSG IS DONE

    // When ever there is a problem in registering re-render the "/register" route.
    response.cookie("flashMessage", flashMessage("Sorry we have touble in registering you in please follow the correct details.", "danger"));
    response.redirect("/register");
  });
});

// ROUTES FOR ADDING IDEA 
app.get("/ideas/add", (request, response)=>{
  if(isAuthenticated(request)){
    return response.render("_addIdea", {loggedIn : true});
  }

  // [COMPLETE] FLASH MESSAGE ADDED
  response.cookie("flashMessage", flashMessage("Sorry you have to login first.", "danger"));
  response.redirect("/login");
});

app.post("/ideas/add", (request, response)=>{
  console.log(request.body);
  response.redirect("/ideas");
});

// RENDER ALL THE IDEAS
app.get("/ideas", (request, response)=>{

  if(isAuthenticated(request)){
    let flash = undefined;
    if(typeof request.cookies.flashMessage !== "undefined"){
      flash = JSON.parse(request.cookies.flashMessage);
    }
    response.clearCookie("flashMessage");
    return response.render("_Ideas", {loggedIn : true, flash });
  }

  // [COMPLETE] FLASH MESSAGE ADDED
  response.cookie("flashMessage", flashMessage("Sorry you have to login first.", "danger"));
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




































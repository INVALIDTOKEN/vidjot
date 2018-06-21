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

// FOR CREATING OR CHECKING CUSTOM FLASH MESSAGES
const custormFlash = require("./requiredFunction/flash.js");

// LOADING ROUTES
const { registerUserRoute } = require("./routes/registerUserRoute.js");
const { loginUserRoute } = require("./routes/loginUserRoute.js");
const { addIdeaRoute } = require("./routes/addIdeaRoute.js");

const isAuthenticated = function(request, property){
  return (typeof request.user !== "undefined");
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

// PARSING THE REQUEST PAYLOAD
app.use("/", bodyParser);

// STATIC SERVER
app.use("/static", express.static("./public"));


app.get("/", (request, response)=>{
  response.render("_home");
});
app.get("/about", (request, response)=>{
  response.render("_about");
});


// ROUTE FOR REGISTERING USER 
app.use("/register", registerUserRoute);

// ROUTES FOR LOGINING IN
app.use("/login", loginUserRoute);

// ROUTES FOR ADDING IDEA 
app.use("/ideas/add", addIdeaRoute);

// RENDER ALL THE IDEAS
app.get("/ideas", (request, response)=>{

  if(isAuthenticated(request)){
    let flashInfo = undefined;
    let flashMessage = custormFlash.checkCustomFlashMsg(request);
    if(flashMessage.present){
      flashInfo = flashMessage.flashInfo;
    }
    response.clearCookie("flashMessage");
    return response.render("_Ideas", {loggedIn : true, flash : flashInfo });
  }

  // [COMPLETE] FLASH MESSAGE ADDED
  response.cookie("flashMessage", custormFlash.createFlashInfo("Sorry you have to login first.", "danger"));
  response.redirect("/login");
});

app.listen(port, hostName, ()=>{
  console.log(`Server running at ${hostName}:${port}`);
});




// THINGS TO START WITH 
  // Flash messages [COMPLETE]
  // registerUserModel server validation 
  // Make sure to validate both the user agent and the server
  // Use a hashing module to store the hash password
  // See what are express global variables [NO NEED]




































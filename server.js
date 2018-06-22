"use strict";

require("./mongooseSetup/mongoooseSetup.js");
require("./passportConfig/passportConfig.js");
const mongoose = require("mongoose");
const express = require("express");
const { bodyParser } = require("./bodyParser.js");
const { RegisterUserModel } = require("./mongooseModel/RegisterUserModel.js");
const { createUser } = require("./mongooseDocument/registerUserDoc.js");
const { createIdea } = require("./mongooseDocument/ideaDoc");
const { IdeaModel } = require("./mongooseModel/IdeaSchema.js");
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

const isAuthenticated = function (request) {
  return (typeof request.user !== "undefined");
}

app.use(
  cookieSession(
    {
      maxAge: 24 * 60 * 60 * 1000,
      keys: ["kitty kat"]
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


app.get("/", (request, response) => {
  response.render("_home");
});
app.get("/about", (request, response) => {
  response.render("_about");
});


// ROUTE FOR REGISTERING USER 
app.use("/register", registerUserRoute);

// ROUTES FOR LOGINING IN
app.use("/login", loginUserRoute);

// ROUTES FOR ADDING IDEA 
app.use("/ideas/add", addIdeaRoute);

// RENDER ALL THE IDEAS
app.get("/ideas", (request, response) => {

  if (isAuthenticated(request)) {
    let flashInfo = undefined;
    let flashMessage = custormFlash.checkCustomFlashMsg(request);

    if (flashMessage.present) {
      flashInfo = flashMessage.flashInfo;
    }
    response.clearCookie("flashMessage");

    IdeaModel.find({ writtenBy: request.user._id })
      .then((documents) => {
        if (documents.length === 0) {
          return response.render("_ideas", { flash: flashInfo, loggedIn: true, renderIdea: false })
        }
        return response.render("_ideas", { flash: flashInfo, loggedIn: true, renderIdea: true, ideas: documents.reverse() });
      });
    // return response.render("_Ideas", { loggedIn: true, flash: flashInfo });
  } else {
    // [COMPLETE] FLASH MESSAGE ADDED
    response.cookie("flashMessage", custormFlash.createFlashInfo("Sorry you have to login first.", "danger"));
    response.redirect("/login");
  }
});


// RENDERING A SINGLE IDEA
app.get("/ideas/show/:id", (request, response) => {

  if (isAuthenticated(request)) {
    let id = request.params.id;
    IdeaModel.findById(id)
      .then((document) => {

        // IF THERE IS NO DOCUMENT
        if (document === null) {
          return response.render("_showIdea", { flash: { message: "Incorrect Id given", type: "danger" }, loggedIn: true, renderIdea: false });
        }

        let flashMessage = custormFlash.checkCustomFlashMsg(request);
        if (!flashMessage.present) {
          flashMessage = false;
        } else {
          flashMessage = flashMessage.flashInfo;
        }

        response.clearCookie("flashMessage");
        return response.render("_showIdea", { flash: flashMessage, loggedIn: true, renderIdea: true, idea: document });

      })
      .catch((error) => {
        return response.render("_showIdea", { flash: { message: "Incorrect Id given", type: "danger" }, loggedIn: true, renderIdea: false });
      });
  } else {
    response.redirect("/login");
  }
});


// DELETING AN IDEA

app.get("/idea/delete/:id", (request, response) => {
  if (isAuthenticated(request)) {
    let objectId = request.params.id;
    let loggedInUser = request.user._id;
    IdeaModel.findOneAndRemove({ _id: objectId, writtenBy: loggedInUser })
      .then((document) => {
        if(document === null){
          response.cookie("flashMessage", custormFlash.createFlashInfo("Sorry Either the document you are looking for is not present or you are not autherized to delete that document.", "danger"));
          return response.redirect("/ideas");
        }

        response.cookie("flashMessage", custormFlash.createFlashInfo("Document has been successfully deleted.", "success"));
        return response.redirect("/ideas");
      });
  } else {

  }
  // 
});

app.listen(port, hostName, () => {
  console.log(`Server running at ${hostName}:${port}`);
});




// THINGS TO START WITH 
  // ideas submit server validation [FIRST THING IN THE MORNING]
  // register user unique email msg
  // complete /ideas route 
  // complete update and delete functionality 
  // Use a hashing module to store the hash password




































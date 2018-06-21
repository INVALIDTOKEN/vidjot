const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

const flashMessage = function(message, type){
  return JSON.stringify({ message , type });
}

router.get("/", (request, response, next)=>{
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

router.post("/", passport.authenticate("local", {
  failureRedirect : "/login",
  failureFlash : true
}),  (request, response)=>{
  response.redirect("/ideas");
});

module.exports = {loginUserRoute : router}

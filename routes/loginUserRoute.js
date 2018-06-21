const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
const customFlash = require("../requiredFunction/flash.js");

router.get("/", (request, response, next)=>{
  // IF USER IS LOGGEDIN DON'T SHOW
  if(request.user){
    response.cookie("flashMessage", customFlash.createFlashInfo("You have already logged in no need to log in again.", "info"));
    return response.redirect("/ideas");
  }

  // FLASH MESSAGE DEFINED BY PASSPORT
  let pFlash = request.flash("error")[0];

  if(customFlash.checkCustomFlashMsg(request).present){

    response.clearCookie("flashMessage");
    return response.render("_login", { flash : customFlash.checkCustomFlashMsg(request).flashInfo });

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

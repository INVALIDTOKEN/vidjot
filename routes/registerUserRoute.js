const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();


// ROUTES FOR REGISTERING A USER
router.get("/", (request, response)=>{
  let flashInfo = request.cookies.flashMessage;
  if(typeof flashInfo !== "undefined"){
    let flash = JSON.parse(flashInfo);
    response.clearCookie("flashMessage");
    return response.render("_register", { flash });
  }
  response.render("_register");
});


// [TODO] MAKE AN INSTANCE METHOD FOR STORING THE DOCUMENT
router.post("/submit", (request, response)=>{
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

module.exports = { registerUserRoute : router };

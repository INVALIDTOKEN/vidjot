const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
const customFlash = require("../requiredFunction/flash.js");
const { createIdea } = require("../mongooseDocument/ideaDoc.js");

const ideaDetails = function(user, idea){
  return {
    author : user._id,
    title : idea.title,
    details : idea.details
  };
}

const isAuthenticated = function(request, property){
  return (typeof request.user !== "undefined");
}

router.get("/", (request, response)=>{
  if(isAuthenticated(request)){
    return response.render("_addIdea", {loggedIn : true, pageTitle : "Add Idea"});
  }

  // [COMPLETE] FLASH MESSAGE ADDED
  response.cookie("flashMessage", custormFlash.createFlashInfo("Sorry you have to login first.", "danger"));
  response.redirect("/login");
});

router.post("/", (request, response)=>{
  createIdea(ideaDetails(request.user, request.body)).save()
  .then((document)=>{
    response.send(document);
  });
});

module.exports = { addIdeaRoute : router };

"use strict";
const LocalStrategy = require("passport-local");
const passport = require("passport");
const { RegisterUserModel } = require("../mongooseModel/RegisterUserModel");

const flashMessage = function(message, type){
  return JSON.stringify({ message , type });
}

const checkForUser = function(email, password, done){
  let errorMessage = "Sorry can't log you in password or email is not correct."; 
  let errorType = "danger";
  RegisterUserModel.findOne({ email, password })
  .then((document)=>{
    
    // IF THERE IS NO DOCUMENT PRESENT 
    if(document === null){
      return done(null, false, {message : flashMessage(errorMessage, errorType)});
    }

    return done(null, document);
  })
  .catch((error)=>{
    done(null, false, {message : flashMessage(errorMessage, errorType)});
  });
}

passport.use("local", new LocalStrategy({usernameField : "email"}, checkForUser));

passport.serializeUser((user, done) => {
  done(null, { id : user._id});
});

passport.deserializeUser((object, done)=>{
  RegisterUserModel.findById({ _id : object.id })
  .then((document)=>{
    done(null, document);
  });
});



























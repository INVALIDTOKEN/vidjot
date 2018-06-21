"use strict";
const LocalStrategy = require("passport-local");
const passport = require("passport");
const { RegisterUserModel } = require("../mongooseModel/RegisterUserModel");


const checkForUser = function(email, password, done){
  RegisterUserModel.findOne({ email, password })
  .then((document)=>{
    if(document === null){
      console.log("Ya It ran")
      let flashInfo = {
        loggedIn : false,
        message : "Sorry can't log you in password or email is not correct.",
        type : "danger"
      }
      return done(null, false, {message : JSON.stringify(flashInfo)});
    }
    return done(null, document);
  })
  .catch((error)=>{
    let flashInfo = {
      loggedIn : false,
      message : "Sorry can't log you in password or email is not correct.",
      type : "danger"
    }
    done(null, false, {message : JSON.stringify(flashInfo)});
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



























"use strict";
const LocalStrategy = require("passport-local");
const passport = require("passport");
const { RegisterUserModel } = require("../mongooseModel/RegisterUserModel");


const checkForUser = function(email, password, done){
  RegisterUserModel.findOne({ email : email , password : password})
  .then((document)=>{
    console.log("The document is : ")
    console.log(document);
    return done(null, document);
  })
  .catch((error)=>{
    done(null, false);
  });
}

passport.use("local", new LocalStrategy({usernameField : "email"}, checkForUser));

passport.serializeUser((user, done)=>{
  console.log(user);
  done(null, { id : user._id, name : user.name, email : user.email});
});

passport.deserializeUser((object, done)=>{
  RegisterUserModel.findById({ _id : object._id })
  .then((document)=>{
    done(null, document);
  });
});



























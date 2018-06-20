"use strict";
const LocalStrategy = require("passport-local");
const passport = require("passport");
const { RegisterUserModel } = require("../mongooseModel/RegisterUserModel");


const checkForUser = function(email, password, done){
  RegisterUserModel.findOne({ email, password })
  .then((document)=>{
    console.log("The document is : ")
    console.log(document);
    done(null, document);
  })
  .catch((error)=>{
    done(null, false);
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



























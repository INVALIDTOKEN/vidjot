"use strict";

const { RegisterUserModel } = require("../mongooseModel/RegisterUserModel.js");

let createUser = function(object){
  let newUser = new RegisterUserModel({
    name : object.name,
    email : object.email,
    password : object.password
  });
  return newUser;
}

module.exports = { createUser };


































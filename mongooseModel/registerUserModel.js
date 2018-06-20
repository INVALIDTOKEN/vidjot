"use strict";

const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const RegisterUserSchema = new Schema({
  name : {
    type : String,
    required : true,
    trim : true
  },
  email : {
    type : String,
    required : true,
    trim : true,
    validate : {
      validator : value=>validator.isEmail(value),
      msg : `{value} is not valid`
    }
  },
  password : {
    type : String,
    trim : true
  }
});

const RegisterUserModel = mongoose.model("registerUsers", RegisterUserSchema);

module.exports = { RegisterUserModel };































const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const registerUserSchema = new Schema({
  name : {
    type : string,
    required : true,
    trim : true
  },
  email : {
    type : string,
    required : true,
    trim : true,
    validate : {
      validator : value=>validator.isEmail(value),
      msg : `${value} is not valid`
    }
  },
  password : {
    type : string,
    trim : true,
    minlength : 5,
    maxlength : 15
  }
});

const registerUserModel = mongoose.model("registerUsers", registerUserSchema);

module.exports = { registerUserModel };




























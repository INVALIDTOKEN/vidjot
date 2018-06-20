"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose; 

const IdeaSchema = new Schema({
  title : {
    type : String,
    required : true
  },
  details : {
    type : String,
    required : true
  },
  date: {
    type : String,
    default : Date.now
  }
});

const IdeaModel = mongoose.model("ideas", IdeaSchema);

module.exports = { IdeaModel };































"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose; 
const { ObjectId } = Schema;

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
  },
  autheredBy : {
    type : ObjectId, 
    required : true
  }
});

const IdeaModel = mongoose.model("ideas", IdeaSchema);

module.exports = { IdeaModel };































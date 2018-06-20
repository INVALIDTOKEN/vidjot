"use strict";
const { IdeaModel } = require("../mongooseModel/IdeaSchema.js");

let createIdea = function(object){
  let newIdea = new IdeaModel({
    title : object.title,
    details : object.details
  });
  return newIdea;
}

module.exports = { createIdea };






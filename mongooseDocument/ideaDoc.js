"use strict";
const { IdeaModel } = require("../mongooseModel/IdeaSchema.js");

let createIdea = function(object){
  let newIdea = new IdeaModel({
    title : object.title,
    details : object.details,
    writtenBy : object.author
  });
  return newIdea;
}

module.exports = { createIdea };






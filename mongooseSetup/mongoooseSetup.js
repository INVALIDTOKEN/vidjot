const mongoose = require("mongoose");

// Map global promise --> doing this will remove the Warning
mongoose.Promise = global.Promise;

const url = "mongodb://localhost:27017";
const dbName = "vidjotDB";

mongoose.connect(`${url}/${dbName}`)
.then(()=>{console.log("MongoDB connected")})
.catch(()=>{console.log("Error in connecting to the MongoDB database")});
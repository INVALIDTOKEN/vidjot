const express = require("express");
const pug = require("pug");
const app = express();
const port = 3000;
const hostName = "127.0.0.1";

// SETTING A TEMPLATE ENGINE
app.set("view engine", "pug");
app.set("views", "./views");

app.use("/", (request, response, next)=>{
  if(request.method === "POST"){
    console.log(request.headers);
    let string = "";
    request.on("data", (chunk)=>{
      string += chunk;
    });
    request.on("end", ()=>{
      console.log(string);
    });
    next(); 
  }
});

app.post("/", (request, response)=>{
  response.send("Running");
});

app.listen(port, hostName, ()=>{
  console.log(`Server running at ${hostName}:${port}`);
});









































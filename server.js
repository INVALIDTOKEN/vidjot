const express = require("express");
const pug = require("pug");
const app = express();
const port = 3000;
const hostName = "127.0.0.1";

// SETTING A TEMPLATE ENGINE
app.set("view engine", "pug");
app.set("views", "./views");

// STATIC SERVER
app.use("/static", express.static("./public"));

app.get("/", (request, response)=>{
  response.render("_home");
});

app.get("/about", (request, response)=>{
  response.render("_about");
});

app.get("/login", (request, response, next)=>{
  response.render("_login");
});

app.get("/register", (request, response)=>{
  response.render("_register");
});

app.listen(port, hostName, ()=>{
  console.log(`Server running at ${hostName}:${port}`);
});









































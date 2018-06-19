const querystring = require("querystring");

// convert the data into valid JavaScript object
let convertData = function(string, type){
  if(string === ""){
    return {};
  }else if(type === "application/json"){
    return JSON.parse(string);
  }else if(type === "application/x-www-form-urlencoded"){
    return querystring.parse(string);
  }else{
    return new Error("Cannot Match type");
  }
};

// fetch the data from the request object
let getData = function(request, {type}){
  return new Promise((resolve, reject)=>{
    let string = "";

    request.on("data", (chunk)=>{
      string += chunk;
    });

    request.on("end", ()=>{

      // console.log("String  is : " + string);
      let object = convertData(string, type);

      if(object instanceof Error){
        reject("Cannot parse string");
      }else{
        resolve(object);
      }

    });

  });
}

let callGetData = function (request, contentType, next){
  getData(request, {type : contentType})
  .then((result) => {
    request.body = result;
    next();
  })
  .catch((result)=>{
    request.body = { error : "Error in parsing data" };
    next();
  });;
}

let bodyParser = function(request, response, next){
  // if method is post try to check the content-type header
  if(request.method === "POST"){

    // if content-type is application/json or application/x-www-form-urlencoded
      // parse the data
      // convent it into javascript object
      // store it into request.body property  
    if(request.headers["content-type"] === "application/json"){

      callGetData(request, request.headers["content-type"], next);
      console.log("Ya that's async");

    }else if(request.headers["content-type"] === "application/x-www-form-urlencoded"){

      callGetData(request, request.headers["content-type"], next);
      console.log("Ya that's async");

    }else{
      request.body = { error : "Content type must be either \"application/json\" or \"application/x-www-form-urlencoded\"" };
      next();
    }

  }else{
    request.body = {
      error : "cannot parse data in GET request",
      help : "check the request object"
    };
    next();
  }
}

module.exports = { bodyParser };








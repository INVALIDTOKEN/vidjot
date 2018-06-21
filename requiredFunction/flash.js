
const createFlashInfo = function(message, type){
  return JSON.stringify({ message , type });
}

const checkCustomFlashMsg = function(request){
  let flashInfo = request.cookies.flashMessage;
  let rtnInfo = {};
  if(typeof flashInfo !== "undefined"){
    rtnInfo.present = true;
    rtnInfo.flashInfo = JSON.parse(flashInfo);
  }else{
    rtnInfo.present = false;
  }

  return rtnInfo;
}

module.exports = { createFlashInfo, checkCustomFlashMsg };
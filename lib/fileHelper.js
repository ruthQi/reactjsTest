var fs = require('fs');
var path = require('path');

var eachFile = function (file, callback){
   if (fs.statSync(file).isFile()) {
      callback(file);
   } else{
      var files = fs.readdirSync(file);
      if (files) {
         files.forEach(function(sub) {
            eachFile(path.join(file, sub), callback);
         });
      }
   }
};

module.exports = {
   eachFile: eachFile
}
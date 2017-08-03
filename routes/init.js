'use strict';

var index = require('./page/index');
var ES6Test = require('./page/ES6Test');
var Family = require('./page/family');



module.exports = function(express, app) {

   app.use('/', index);
   app.use('/es6', ES6Test);
   app.use('/family', Family);

};
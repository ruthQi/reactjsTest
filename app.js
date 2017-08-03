'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var exphbs  = require('express-handlebars');
var ejs = require('ejs');
var ejsEngine = require('ejs-mate');
var app = express();

var env = app.get('env') || 'development';
console.log('env = ' + env);
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';
app.locals.ENV_PREVIEW = env === 'preview';
app.locals.ENV_PRODUCTION = env === 'production';

// var viewsPath = '';
// if (app.locals.ENV_DEVELOPMENT) {
//    viewsPath = './views/dev';
// } else {
//    viewsPath = './views/release';
// }

// view engine setup
// app.engine('.hbs', exphbs({
//   extname: '.hbs',
//   layoutsDir: viewsPath + '/layouts',
//   defaultLayout: 'main',
//   partialsDir: [viewsPath + '/partials/'],
//   helpers: {
//       foo: function () { return 'FOO!'; },
//       bar: function () { return 'BAR!'; },
//       scriptSrc: function (src) {
//          return src;
//       }
//    }
// }));
// app.set('view engine', '.hbs');

app.engine('ejs', ejsEngine);
app.set('view engine', 'ejs');
if (env === 'development') {
   app.set('views', path.join(__dirname, './views/dev/'));
} else {
   app.set('views', path.join(__dirname, './views/release/'));
}

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
if (env === 'development') {
   console.log('=============  connect-livereload   ================');
   app.use(require('connect-livereload')({
      port: 35729
   }));
   app.use(express.static(path.join(__dirname, 'public/dist')));
} else {
   app.use(express.static(path.join(__dirname, 'public/built')));
}

// 初始化路由
require('./routes/init')(express, app);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;
var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var router=express.Router();
//var indexRouter = require('./routes/index');
//var middleRouter = require('./routes/middleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const allRouters = require('./routes/index');
var indexRouter = express.Router().get('/', function(req, res) {
  res.render("homepage");   
  //res.json({ message: 'Hi，this is restFul API' });   
  });
  app.use('/', indexRouter);
//app.use('/middleware', middleRouter);

for(var key in allRouters) {
	app.use('/api/'+key, allRouters[key]);
}
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //return res.status(err.status || 500);
  res.status(err.status || 500);
  res.render('error');
  //res.end()
});

module.exports = app;

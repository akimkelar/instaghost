var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ghost', { useNewUrlParser: true });

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiConfig = require('./routes/api/config');
var apiAuthToken = require('./routes/api/auth/token');
var apiGhostsRouter = require('./routes/api/ghosts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers","*");
  res.header("Access-Control-Allow-Origin","http://localhost:4200");
  res.header('Content-type', 'application/json');
  next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/config', apiConfig);
app.use('/api/auth/token', apiAuthToken);
app.use('/api/ghosts', apiGhostsRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

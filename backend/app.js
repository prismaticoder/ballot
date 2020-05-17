var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();
var cors = require('cors');
var { sendError } = require('./controllers/res')

//Define route files
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
var regionRouter = require('./routes/region');
var candidateRouter = require('./routes/candidates')
var adminRouter = require('./routes/admin');

var { validateAdminToken } = require('./controllers/middleware'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({secret: process.env.SESSION_SECRET}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/candidates', candidateRouter);
app.use('/admin', validateAdminToken , adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send error json
  
  sendError(res,err.status || 500)
});

module.exports = app;

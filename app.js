var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var productsRouter = require('./routes/products');
var topicsRouter = require('./routes/topics');

var app = express();

//mongodb
var mongodbfunc = require('./models/mongodbfunc');



//ejs  use html
var ejs = require('ejs');
app.engine('html', ejs.__express);
app.set('view engine', 'html')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/products', productsRouter);
app.use('/topics', topicsRouter);

//my router
/*
app.get('/login', function(req, res){
	res.send('login');
});
*/
app.get('/home', function(req, res){
	res.send('home');
})


//session settings
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var identityKey = 'key';

app.use(session({
	name : identityKey,
	secret : 'name1', 
	store : new FileStore(), 
	resave : false, 
	saveUninitialized: true,
	cookie : {
		maxAge: 60*1000
	}
}));
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//users
var users = require('./usersinfo').items;



//socket status
app.get('/status', function(req, res, next){
	var sess = req.session;
	res.json((sess));
});

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

var express=require('express');
var mongoose = require('mongoose');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');
var path=require('path');
var app=express();

//config
	mongoose.connect(configDB.url);

// configuew app
	app.use(morgan('dev'));
	app.use(cookieParser());
	app.use(bodyParser());
	app.set('view engine','ejs');

//	app.set('views/Layout_App/',path.join(__dirname,'views/Layout_App/'));
// required for passport
	app.use(session({secret:'Phat'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
// use middleware
	app.use(express.static(path.join(__dirname,'bower_components')));

//index page
	app.get('/', function(req,res){
		res.render('Page/index')
	});
// define routes
	require('./app/routes.js')(app,passport);
	require('./config/passport')(passport);

app.listen(3000,function(){
	console.log('ready on port 3000');

});
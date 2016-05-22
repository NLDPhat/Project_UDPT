module.exports=function(app,passport){

//Home page

	app.get('/',function(req,res){
		res.render('Page/index.ejs');
	});

//Login

	app.get('/login',function(req,res){
		res.render('Partials/login.ejs',{message:req.flash('loginMessage')})
	});

	app.post('/login', passport.authenticate('local-login',{
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req,res){
		res.render('Partials/signup.ejs',{message: req.flash('signupMessage')})
	});

	app.get('/profile',isLoggedIn, function(req, res){
		res.render('Partials/profile.ejs',{ user : req.user })
	});

	app.post('/signup',passport.authenticate('local-signup',{
		successRedirect : '/Partials/profile',
		failureRedirect : '/Partials/signup',
		failureFlash : true
	}));
}

	function isLoggedIn(req, res, next){
		if(req.isAuthenticated())
			return next();
		res.redirect('/');
	}
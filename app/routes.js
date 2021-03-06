module.exports=function(app,passport){

//Home page

app.get('/',function(req,res){
	res.render('Page/index.ejs')
});

//Login
app.get('/login',function(req,res){
	res.render('Partials/login.ejs')
});

app.get('/login_local',function(req,res){
	res.render('Partials/login_local.ejs',{message:req.flash('loginMessage')})
});

app.post('/login_local', passport.authenticate('local-login',{
	successRedirect: '/profile',
	failureRedirect: '/login_local',
	failureFlash: true
}));

app.get('/signup', function(req,res){
	res.render('Partials/signup.ejs',{message: req.flash('signupMessage')})
});

app.get('/profile',isLoggedIn, function(req, res){
	res.render('Partials/profile.ejs',{ 
		user : req.user 
	});
});

app.post('/signup',passport.authenticate('local-signup',{
	successRedirect : '/Partials/profile',
	failureRedirect : '/Partials/signup',
	failureFlash : true
}));

//////FACEBOOK
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
    	passport.authenticate('facebook', {
    		successRedirect : '/profile',
    		failureRedirect : '/'
    	}));

    // route for logging out
    app.get('/logout', function(req, res) {
    	req.logout();
    	res.redirect('/');
    });

/// Send mail
app.get('/Email',function(req,res){
	res.render('Partials/Email.ejs')
});
app.get('Email', function(req,res){
	var mailOption={
		to: req.query.to,
		subject: req.query.subject,
		text: req.query.text
	}
	console.log(mailOption);
	smtpTransport.sendMail(mailOption,function (error,response) {
		if(error){
			console.log(error);
			res.end(error);
		}else{
			console.log("Message sent");
			res.end('sent');
		}
	});
});
};

function isLoggedIn(req, res, next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/');
}
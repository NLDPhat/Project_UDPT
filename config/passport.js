var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport){

	passport.serializeUser(function(user,done){
		done(null,user.id);
	});

	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			done(err, user);
		});
	});


// Local - signup
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
//		passReqToCallback : true
	},
	function(req,email, password, done){
		process.nextTick(function(){
			User.findOne({'local.email' : email}, function(err,user){
				if(err)
					return done(err);

				if(user){
					return done(null, false, req.flash('signupMessage','That email is already taken.'));
				} else {
					var newUser = new User();

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null,newUser);
					});
				}
			});
		});
	}));

//Local - login
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'passwords'
//		passReqToCallback : true
	},
	function(req, email, password, done){
		if (email)
			email = email.toLowerCase();
		process.nextTick(function(){
			User.findOne({ 'local.email' : email}, function(err,user){
				if(err)
					return done(err);
				if(!user)
					return done(null,false, req.flash('loginMSM', 'No user found.'));
				if(!user.validPassword(password))
					return done(null, false, req.flash('loginMSM','Wrong Pass'));
				else
					return done(null,user);
			});
		});
	}));
}
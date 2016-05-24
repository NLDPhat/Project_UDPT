var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');

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


////////////////////////////
////FACEBOOK////////////////
////////////////////////////

passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },

function(token, refreshToken, profile, done) {

        process.nextTick(function() {

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));
};
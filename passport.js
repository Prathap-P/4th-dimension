var passportLocal= require('passport-local').Strategy;
var userModel= require('./models/mongoose').userModel;
var bcrypt= require('bcrypt');

function usePassport(passport){
	passport.use(new passportLocal({ usernameField: 'email' }, authenticate));
	passport.serializeUser((User, done)=> {
		console.log("Serialise User");
		done(null, User.id)
		});
	passport.deserializeUser((id, done)=> {
		userModel.findById(id, (err, user)=>{
			if (err) throw err;
			console.log("Deserialise User");
			done(err, user);
		});
	});
}


var authenticate= async(email, password, done)=>{
	var User;
	console.log("Authenticating with email and password");
	try{
		await userModel.findOne({ email: email }, (err, user)=>{
			if (err) throw err ;
			if (!user) { 
				console.log('No user');
				return done(null, false);
			}
			User= user;
		});
		if (await bcrypt.compare(password, User.password)){
			console.log('Credentials authenticated');
			return done(null, User);
		}
		else{
			console.log('password incorrect');
			return done(null, false);
		}
	}
	catch(err){
		console.log(err);
	}
	
}

module.exports= usePassport;
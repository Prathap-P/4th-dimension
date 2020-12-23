var express= require('express');
var authenRouter= express.Router();
var passport= require('passport');
var bcrypt= require('bcrypt');
var models= require('../models/mongoose');

const userLayout= 'layouts/userLayout';


authenRouter.get('/', isAutheticated, async(req, res)=>{
	var all_users;
	all_users= await models.userModel.find().populate("blogs")

	return res.render('home', {
		layout: userLayout,
		authorized_user: req.user,
		all_users: all_users
	});
});

function isAutheticated(req, res, next){
	if(req.user){
		if(req.isAuthenticated())
			return next();
	}
	res.redirect('/login');
}

function isNotAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return res.redirect(''+ req.user.username);
	}
	next();
}

authenRouter.get('/register', isNotAuthenticated, (req, res)=>{
	res.render('register.ejs');
});

authenRouter.post('/register', async(req, res)=>{
	var hashedPassword= await bcrypt.hash(req.body.password, 10);
	// console.log(hashedPassword);
	var newUser= {
		username: req.body.username,
		email: req.body.email,
		password: hashedPassword
	}
	var user= new models.userModel(newUser);
	await user.save((err, User)=>{
		if (err){
			console.log(err);
			res.redirect('/register');
		}
		else{
			res.redirect('/login');
		}
	});
});

authenRouter.get('/login', isNotAuthenticated, (req, res)=>{
	console.log("GET request for login");
	res.render('login.ejs');
});

authenRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'	
}));

authenRouter.get('/logout', (req, res)=>{
	req.logOut();
	console.log("Logged out");
	return res.redirect('/login');
});


module.exports= {
	authenRouter,
	}

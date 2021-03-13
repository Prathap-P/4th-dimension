var express= require('express');
var authenRouter= express.Router();
require('dotenv').config();
var jwt= require('jsonwebtoken');
var cookieParser= require('cookie-parser');
var bcrypt= require('bcrypt');
var models= require('../models/mongoose');
// var passport= require('passport');

const userLayout= 'layouts/userLayout';

async function isAuthenticated(req, res, next){

	try{
		const tokenToCheck= req.cookies['token'];

		//Cookie not present
		if(!tokenToCheck)
			throw new Error('cookie not set');

		//Verifying the cookie
		const userLoggedIn= await jwt.verify(tokenToCheck, process.env.SECRET);

		//If verification successfull, setting the header "user" with the logged in user's email
		res.locals.user= userLoggedIn.email;
		// console.log(req.headers);
		next();

	}
	catch(e){
		// console.log(e);
		res.redirect('/login');
	}
}


authenRouter.get('/', isAuthenticated, async(req, res)=>{
	var all_users;
	all_users= await models.userModel.find().populate("blogs")

	res.render('home', {
		layout: userLayout,
		authorized_user: res.locals.user,
		all_users: all_users
	});
});

authenRouter.get('/register', (req, res)=>{
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


authenRouter.get('/login', (req, res)=>{
	res.render('login.ejs');
});


authenRouter.post('/login', async(req, res)=>{

	const userEmail= req.body.email, userPassword= req.body.password;

	try{
		const userFromDB= await models.userModel.findOne({email : userEmail});

		//Checking whether the user is present
		if(!userFromDB)
			throw new Error('Invalid Email');

		//User present, now verifying the password
		const isPasswordMatched= await bcrypt.compare(userPassword, userFromDB.password);

		//Checking whether password matches
		if(!isPasswordMatched)
			throw new Error('Wrong Password');

		//Password Matched, time to set the cookie
		const tokenGenerated= jwt.sign({email : userEmail}, process.env.SECRET);
		res.cookie('token', tokenGenerated, {httpOnly : true});

		res.redirect('/');

	}catch(e){
		console.log(e);
		res.redirect('/login');
	}

});

authenRouter.get('/logout', (req, res)=>{
	res.clearCookie('token');
	console.log(req.cookies['token']);
	return res.redirect('/login');
});

module.exports= {
	authenRouter,
	isAuthenticated
}

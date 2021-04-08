var express= require('express');
var authenRouter= express.Router();
require('dotenv').config();
var jwt= require('jsonwebtoken');
var cookieParser= require('cookie-parser');
var bcrypt= require('bcrypt');
var models= require('../models/mongoose');

function getUserLayout(){
	return 'layouts/userLayout';
}

async function isAuthenticated(req, res, next){

	try{
		const tokenToCheck= req.cookies['token'];

		//Cookie not present
		if(!tokenToCheck)
			throw new Error('cookie not set');

		//Verifying the cookie
		const userLoggedIn= await jwt.verify(tokenToCheck, process.env.SECRET);

		//If verification successfull, setting the locals with the logged in user's id
		res.locals.userId= userLoggedIn.id;
		// console.log(req.headers);
		next();

	}
	catch(e){
		res.redirect(`/login?redirect=${req.originalUrl}`);
	}
}


authenRouter.get('/', isAuthenticated, async(req, res)=>{
	try{
		const all_users= await models.userModel.find().populate("blogs")

		res.render('home', {
			layout: getUserLayout(),
			authorized_userId: res.locals.userId,
			all_users: all_users
			}
		);
	}
	catch(e){
		console.log(e);
	}
});

authenRouter.get('/register', (req, res)=>{
	res.render('register.ejs');
});

authenRouter.post('/register', async(req, res)=>{
	try{
		
		const hashedPassword= await bcrypt.hash(req.body.password, 10);

		const newUser= {
			username: String(req.body.username),
			email: String(req.body.email),
			password: hashedPassword
		}

		const user= await new models.userModel(newUser);
		await user.save();

		res.redirect('/login');
	}
	catch(e){
		res.redirect(req.originalUrl);
		console.log(e);
	}
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
		const tokenGenerated= jwt.sign({id : userFromDB.id}, process.env.SECRET);
		res.cookie('token', tokenGenerated, {httpOnly : true});

		// console.log(req);
		res.redirect(req.query.redirect || '/');

	}
	catch(e){
		console.log(e);
		res.redirect(req.url);
	}

});

authenRouter.get('/logout', (req, res)=>{
	res.clearCookie('token');
	res.redirect('/login');
});

module.exports= {
	authenRouter,
	isAuthenticated
}

var express= require('express');
var router= express.Router();
var mongoose= require('mongoose');
var models= require('../models/mongoose');
// var isAuthenticated= require("./authentication").isAuthenticated;

router.get('/new', checkAnonymous, (req, res)=>{
	
	var options= {
		layout: 'layouts/userLayout'
	}
	
	res.render('newBlog.ejs', options);
})

router.get('/user', checkAnonymous, async(req, res)=>{
	var curr_user;
	curr_user= await models.userModel.findOne({ email: req.user.email 		}).populate("blogs");
	
	var options= {
		layout: 'layouts/userLayout',
		curr_user
	}
	
	res.render('your_blogs.ejs', options);
})

function checkAnonymous(req, res, next){
	if(req.user){
		return next();
	}
	res.redirect("/login");
}

router.post('/new',async (req, res)=>{
	try{
		var blog= new models.blogModel({
			title: req.body.title,
			content: req.body.content,
			author: req.user.id
		});
		console.log(blog);
		await blog.save();
		models.userModel.findById(req.user.id, (err, user)=>{
			if (err) throw err;
			user.blogs.push(blog);
			user.save();
			console.log("New Blog saved");
		});
			res.redirect('/');
	}catch(e){
		console.log(e);
	}
})

// router.delete("/delete/:id", (req, res)=>{
	// userModel.findByIdAndDelete(id)
		// .then(console.log("Blog deleted"));
// });


module.exports= router;


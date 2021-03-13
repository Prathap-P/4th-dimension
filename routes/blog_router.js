var express= require('express');
var router= express.Router();
var mongoose= require('mongoose');
var models= require('../models/mongoose');
var isAuthenticated= require("./authentication").isAuthenticated;


router.get('/new', isAuthenticated, (req, res)=>{
	
	var options= {
		layout: 'layouts/userLayout'
	}
	
	res.render('newBlog.ejs', options);
})

router.get('/user', isAuthenticated, async(req, res)=>{
	var curr_user;
	curr_user= await models.userModel.findOne({ email: res.locals.user 		}).populate("blogs");
	
	var options= {
		layout: 'layouts/userLayout',
		curr_user
	}
	
	res.render('your_blogs.ejs', options);
})


router.post('/new',async (req, res)=>{
	try{
		var blog= new models.blogModel({
			title: req.body.title,
			content: req.body.content,
			author: req.user.id
		});
		console.log(blog);
		await blog.save();
		models.userModel.findOneById(req.user.id, (err, user)=>{
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


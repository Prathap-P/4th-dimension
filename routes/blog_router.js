var express= require('express');
var router= express.Router();
var mongoose= require('mongoose');
var models= require('../models/mongoose');
var isAuthenticated= require("./authentication").isAuthenticated;

router.use(express.static('public'));

router.get('/new', isAuthenticated, (req, res)=>{
	
	var options= {
		layout: 'layouts/userLayout'
	}
	
	res.render('newBlog.ejs', options);
})

router.get('/user', isAuthenticated, async(req, res)=>{
	var curr_user= await models.userModel.findOneById(res.locals.userId).populate("blogs");
	
	var options= {
		layout: 'layouts/userLayout',
		curr_user
	}
	
	res.render('your_blogs.ejs', options);
})


router.post('/new', isAuthenticated, async(req, res)=>{
	try{
		var blog= await new models.blogModel({
			title: req.body.title,
			content: req.body.content,
			author: res.locals.userId
		});
		// console.log(blog);
		await blog.save();
		console.log(res.locals.userId);
		
		const currUser= await models.userModel.findOne({_id : res.locals.userId});
		console.log(currUser);
		
		currUser.blogs.push(blog);
		currUser.save();
		
		res.redirect('/');
	}catch(e){
		console.log(e);
	}
})

// router.delete("/delete/:id", (req, res)=>{
	// userModel.findByIdAndDelete(id)
		// .then(console.log("Blog deleted"));
// });


module.exports= {
	blogRouter : router	
};


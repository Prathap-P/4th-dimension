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
	
	try{
		const curr_user= await models.userModel.findOneById(res.locals.userId).populate("blogs");
		
		var options= {
			layout: 'layouts/userLayout',
			curr_user
		}
		
		res.render('your_blogs.ejs', options);		
	}
	catch(e){
		console.log(e);
	}
})


router.post('/new', isAuthenticated, async(req, res)=>{
	try{
		const blog= await new models.blogModel({
			title: req.body.title,
			content: req.body.content,
			author: res.locals.userId
		});

		await blog.save();
		
		const currUser= await models.userModel.findOne({_id : res.locals.userId});
		
		currUser.blogs.push(blog);
		await currUser.save();
		
		res.redirect('/');
	}
	catch(e){
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


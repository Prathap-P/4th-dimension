var express= require('express');
var router= express.Router();
var mongoose= require('mongoose');
var models= require('../models/mongoose');
var isAuthenticated= require("./authentication").isAuthenticated;

router.use(express.static('public'));
router.use("/read", express.static('public'));

const distributor= {
	getUserModel : ()=> models.userModel,
	getBlogModel : ()=> models.blogModel,
	getUserLayout : ()=> 'layouts/userLayout',
	getGeneralLayout : ()=> 'layouts/generalLayout',
	
	chooseLayout: function(idLoggedIn){
		if(idLoggedIn !== undefined)
			return this.getUserLayout();
		
		return this.getGeneralLayout();
	},

	isCookieSet: (req, res, next)=> {
		if(req.cookies['token'])
			isAuthenticated(req, res, next);
		else
			next();
	}
}

router.get('/', distributor.isCookieSet, async(req, res)=>{
	try{
		const blogsList= await distributor.getBlogModel().find().populate('author');

		var options= {
			layout: distributor.chooseLayout(res.locals.userId),
			authorized_userId: res.locals.userId,
			blogsList
		};

		res.render('allBlogs', options);
	}
	catch(e){
		console.log(e);
	}
	
});

router.get('/read/:id', distributor.isCookieSet, async(req, res)=>{
	try{
		const blogFound= await distributor.getBlogModel().findById({ _id: req.params.id }).populate('author');
		
		var options= {
			layout: distributor.chooseLayout(res.locals.userId),
			authorized_userId: res.locals.userId,
			blog: blogFound
		}

		res.render('readBlog.ejs', options);
	}
	catch(e){
		console.log(e);
	}
});


router.get('/user', isAuthenticated, async(req, res)=>{
	
	try{
		const curr_user= await models.userModel.findById(res.locals.userId).populate("blogs");
		
		var options= {
			layout: distributor.getUserLayout(),
			curr_user
		}
		
		res.render('your_blogs.ejs', options);		
	}
	catch(e){
		console.log(e);
	}
})


router.get('/new', isAuthenticated, (req, res)=>{
	
	var options= {
		layout: 'layouts/userLayout'
	}
	
	res.render('newBlog.ejs', options);
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
		
		res.redirect('/blogs');
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


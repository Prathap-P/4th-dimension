const mongoose= require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
.then((db)=> {
	console.log("DataBase Connected");
})
.catch(err => console.log(err));

mongoose.set('useCreateIndex', true);

const schema= mongoose.Schema;

var userSchema= new schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	blogs:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog'
	}]
});

var blogSchema= new schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

var userModel= new mongoose.model('User', userSchema);
var blogModel= new mongoose.model('Blog', blogSchema);

module.exports= { 
	userModel,
	blogModel
};

// (async()=>{
	// await userModel.find().populate().exec((err, blog)=>{
		// console.log(blog);
	// });
// })();
	
	// await blogModel.deleteMany();
	// console.log("deleted")

// blogModel.find( (err, user) => {
		
	// console.log(user[0].id)
// });

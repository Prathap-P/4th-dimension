const mongoose= require('mongoose');

mongoose.connect('mongodb://localhost/blogs', { useUnifiedTopology: true, useNewUrlParser: true })
.then((db)=> {
	// console.log(db);
	console.log("DataBase Connected");
})

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

// userModel.findOne({email: 'user@user'}).populate("blogs").exec((err, user)=>{
	// console.log(user);
// });
	
// userModel.deleteMany();
// console.log("deleted")

// blogModel.find( (err, user) => {
		
	// console.log(user[0].id)
// });

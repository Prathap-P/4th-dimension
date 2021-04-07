const mongoose= require('mongoose');

mongoose.connect('mongodb://localhost/blogs', { useUnifiedTopology: true, useNewUrlParser: true })
.then((db)=> {
	console.log("DataBase Connected");
})

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

(async()=>{	
	userModel.find({ _id : '606dccd44ad36d16847843ba'}).populate("blogs").exec((err, user)=>{
		console.log(user);
	});
})();
	
	// await userModel.deleteOne();
	// console.log("deleted")

// blogModel.find( (err, user) => {
		
	// console.log(user[0].id)
// });

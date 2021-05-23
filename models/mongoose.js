const mongoose= require('mongoose');
require('dotenv').config();

const mongoUrl= (process.env.NODE_ENV.trim() === "development") ? process.env.LOCAL_MONGO : process.env.MONGO_URI;

mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true })
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

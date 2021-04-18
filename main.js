var express= require('express');
var path= require('path');
var app= express();
var layouts= require('express-ejs-layouts');
var authenRouter= require('./routes/authentication').authenRouter;
var blog_routes= require('./routes/blog_router').blogRouter;
var body_parser= require('body-parser');
var cookieParser= require('cookie-parser');


app.use(express.static("public"));
app.use(cookieParser());

app.set('port', process.env.PORT || 9000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/generalLayout');
app.use(layouts);

// if the extension is ejs or from some other view engine then the extension is needed 
app.use(body_parser.urlencoded({ extended: false }));

app.use('/', authenRouter);
app.use('/blogs', blog_routes);

app.listen(
	app.get('port'), ()=>{
		console.log(`App listening in port ${app.get("port")}`);
	}); 




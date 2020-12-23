var express= require('express');
var app= express();
var layouts= require('express-ejs-layouts');
var blog_routes= require('./routes/blog_router');
var body_parser= require('body-parser');
var passport= require('passport');
var session= require('express-session');
require('./passport')(passport);
var authenRouter= require('./routes/authentication').authenRouter;

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('layout', 'layouts/generalLayout');
app.use(layouts);
// if the extension is ejs or from some other view engine then the extension is needed 

app.use(express.static('public'));
app.use(body_parser.urlencoded({ extended: false }));
app.use(session({
	secret: 'MONGODB',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', authenRouter);
app.use('/blogs', blog_routes);

app.listen(
	app.get('port'), ()=>{
		"App listening in port " + app.get("port");
	}); 




if(process.env.NODE_ENV != "production") require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

// Adding Routes
const usersRoute = require('./routes/users');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');

// Connecting to database
main().catch(err => console.log('Database Error Occured',err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('connected to database Successfully.');
}

// Making Session Config object
const sessionConfig = {
    secret : "Sonata@78919566",
    saveUninitialized : true,
    resave : false,
    cookie : {
        httpOnly: true,
        maxAge : 1000*60*60*24*7,
        
    }
};

app.use(mongoSanitize());
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(session(sessionConfig));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy( User.authenticate() ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flashing Messages to template through locals
app.use((req, res, next)=>{
    res.locals.success =  req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

// User ROUTE here...
app.use('/users', usersRoute);
// Using our campground route
app.use('/campgrounds', campgroundsRoute);
// Using our Review route
app.use('/campgrounds/:id/reviews', reviewsRoute);


app.get('/', (req,res)=>{
    res.render('home.ejs');
})

// Not Found Page.
app.all( '*' , (req, res, next) => {
    const err = {message: "Requested page is Not FOUND", stack:''};
    res.status(404).render('error', {err})
})

// All Error Handling Middleware
app.use( (err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "O Ooo! Something Went Wrong!";
    res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=>{
    console.log('Started Listining to port 3000');
})
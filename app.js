const express = require('express');
const app = express();
// to access data from others directory too use path
const path = require('path');
const mongoose = require('mongoose');
// to get data from req.body you need to require and use body parser
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// ejsMate is use to DRY up our code in preety good manner and work in ejs template
const ejsMate = require('ejs-mate');
// we need error message thrown from one route into another so creating global ExpressError
const ExpressError = require('./utils/ExpressError');
// Instead of nesting all routes in try cath we impliment one function and use it
const catchAsync = require('./utils/catchAsync');
// Joi is used for validation of data before storing them in DB
const Joi = require('joi');
// JOI require its own Schema to validate DB data
const {campgroundSchema} = require('./schemas');
// importing all models
const Campground = require('./models/campground')

main().catch(err => console.log('Database Error Occured',err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('connected to database Successfully.');
}

app.engine('ejs',ejsMate);
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'));

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

app.get('/', (req,res)=>{
    res.render('home.ejs');
})

// Showing All Campgrounds
app.get('/campgrounds', catchAsync( async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

// Creating new campground

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync ( async (req, res, next) => {
        // if(!req.body.campground){
        //     throw new ExpressError("Your Provided data is not Valid At All.", 400);
        // }

        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
}))

// Showing particular campground
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const mainData = await Campground.findById(id);
    res.render('campgrounds/show', {mainData});
}))

// Editing Campground
app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const mainData = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {mainData})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground})
    res.redirect(`/campgrounds/${req.params.id}`);
}))

// Deleting Campground
app.delete('/campgrounds/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

// Not Found Page.
app.all( '*' , (req, res, next) => {
    next(new ExpressError("Requested page is Not FOUND", 404));
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
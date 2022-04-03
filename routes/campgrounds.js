const express = require('express');
const router = express.Router();

// we need error message thrown from one route into another so creating global ExpressError
const ExpressError = require('../utils/ExpressError');
// Instead of nesting all routes in try cath we impliment one function and use it
const catchAsync = require('../utils/catchAsync');
// importing all models
const Campground = require('../models/campground');
// JOI require its own Schema to validate DB data
const {campgroundSchema} = require('../schemas');


const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


// Showing All Campgrounds
router.get('/', catchAsync( async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}))

// Creating new campground

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync ( async (req, res, next) => {
        // if(!req.body.campground){
        //     throw new ExpressError("Your Provided data is not Valid At All.", 400);
        // }

        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success', 'Campground Added Successfully');
        res.redirect(`/campgrounds/${campground._id}`);
}))

// Showing particular campground
router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const mainData = await Campground.findById(id).populate('reviews');
    if(!mainData){
        req.flash('error', 'Can not Find the Campground Which you are looking for');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {mainData});
}))

// Editing Campground
router.get('/:id/edit', catchAsync(async(req,res)=>{
    const mainData = await Campground.findById(req.params.id);
    if(!mainData){
        req.flash('error', 'Campground Not Found You are looking for.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {mainData})
}))

router.put('/:id', validateCampground, catchAsync(async (req,res)=>{
    const doc = await Campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground})
    if(!doc){
        req.flash('error', "Campground Update Failed");
        return res.redirect('/campgrounds');
    }
    req.flash('success', "Campground Updated Successfully");
    res.redirect(`/campgrounds/${req.params.id}`);
}))

// Deleting Campground
router.delete('/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const doc = await Campground.findByIdAndDelete(id);
    if(!doc){
        req.flash('error', 'Campground Delete Failed');
        return res.redirect('/campgrounds');
    }
    //console.log('Campground Deleted Successfully');
    req.flash('success', 'Campground Deleted Successfully.');
    res.redirect('/campgrounds');
}))


module.exports = router;
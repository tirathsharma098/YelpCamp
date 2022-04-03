const express = require('express');
const router = express.Router({mergeParams:true});
// importing all models
const Campground = require('../models/campground');
const Review = require('../models/review');
// JOI require its own Schema to validate DB data
const {reviewSchema} = require('../schemas');

const ExpressError = require('../utils/ExpressError');
// Instead of nesting all routes in try cath we impliment one function and use it
const catchAsync = require('../utils/catchAsync');

const reviewCampground = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


// Adding Review

router.post('/', reviewCampground, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    if(!review || !campground){
        req.flash('error', "Failed to add Review");
    }
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    //console.log('Review Saved Successfully');
    req.flash('success', 'Review Added Successfully');
    res.redirect(`/campgrounds/${req.params.id}`);
}))


// Deleteing Review

router.delete('/:reviewId', catchAsync( async (req, res) => {
    const {id, reviewId} = req.params;
    const camp = await Campground.findByIdAndUpdate( id, {$pull : {reviews: reviewId} });
    const doc = await Review.findByIdAndDelete(reviewId);
    if(!doc || !camp){
        req.flash('error', "Deletion of Review failed");
        return res.redirect('/campgrounds');
    }
    req.flash('success', 'Review Deleted Successfully');
    res.redirect(`/campgrounds/${id}`);
} ))

module.exports = router;
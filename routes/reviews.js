const express = require('express');
const router = express.Router({mergeParams:true});
// importing all models
const Campground = require('../models/campground');
const Review = require('../models/review');
// Instead of nesting all routes in try cath we impliment one function and use it
const catchAsync = require('../utils/catchAsync');
const {reviewCampground, authenticateUser} = require('../middlewares');


// Adding Review
router.get('/', authenticateUser, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Something Went Wrong!');
        return res.redirect('/campgrounds');
    }
    res.redirect(`/campgrounds/${req.params.id}`);
})
router.post('/', authenticateUser, reviewCampground, catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    if(!review || !campground){
        req.flash('error', "Failed to add Review");
        return res.redirect('/campgrounds');
    }
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    //console.log('Review Saved Successfully');
    req.flash('success', 'Review Added Successfully');
    res.redirect(`/campgrounds/${req.params.id}`);
}))


// Deleteing Review

router.delete('/:reviewId', authenticateUser, catchAsync( async (req, res) => {
    const {id, reviewId} = req.params;
    const reviewBelong = await Review.findById(reviewId);
    if(!reviewBelong && !reviewBelong.author(req.user._id)){
        req.flash('error', "Something Went Wrong");
        return res.redirect('/campgrounds');
    }
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
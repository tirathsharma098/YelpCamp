// JOI require its own Schema to validate DB data
const {campgroundSchema} = require('./schemas');
// we need error message thrown from one route into another so creating global ExpressError
const ExpressError = require('./utils/ExpressError');
// JOI require its own Schema to validate DB data
const {reviewSchema} = require('./schemas');
const Campground = require('./models/campground')


exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

exports.reviewCampground = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

exports.authenticateUser = (req, res, next) => {
    if(!req.isAuthenticated()){
        delete req.session.pathWanted;
        req.session.pathWanted = req.originalUrl;
        req.flash('error', 'You Should LogIn first!');
        return res.redirect('/users/login');
    }
    next();
}

exports.validateCampgroundUser = async (req, res, next) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'Something Went Wrong');
        return res.redirect('/campgrounds');
    }
    next();
}
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');

exports.index = async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

exports.newCampGet =  (req, res) => {
    res.render('campgrounds/new');
}

exports.newCampPost = async (req, res, next) => {
    console.log('Files: ', req.files, 'Body : ', req.body);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log('>> CAMPGROUND SAVED: ', campground);
    req.flash('success', 'Campground Added Successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}

exports.campShow = async (req, res) => {
    const {id} = req.params;
    const mainData = await Campground.findById(id).populate({path:'reviews' , populate : { path : 'author'}});
    if(!mainData){
        req.flash('error', 'Can not Find the Campground Which you are looking for');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {mainData});
}

exports.campUpdateGet = async(req,res)=>{
    const mainData = await Campground.findById(req.params.id);
    if(!mainData){
        req.flash('error', 'Campground Not Found You are looking for.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {mainData})
}

exports.campUpdatePut = async (req,res)=>{
    const {id} = req.params;
    console.log('>> body: ', req.body, '>> FILES RECIEVED: ', req.files);
    const doc = await Campground.findByIdAndUpdate(id,{ ...req.body.campground});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    imgs.length && doc.images.push(...imgs);
    await doc.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await doc.updateOne({$pull: {images: {filename: {$in : req.body.deleteImages}}}})
        console.log('After Deleted Images : ', doc)
    }
    if(!doc){
        req.flash('error', "Campground Update Failed");
        return res.redirect('/campgrounds');
    }
    req.flash('success', "Campground Updated Successfully");
    res.redirect(`/campgrounds/${req.params.id}`);
}

exports.campDelete = async (req, res)=>{
    const { id } = req.params;
    const doc = await Campground.findByIdAndDelete(id);
    if(!doc){
        req.flash('error', 'Campground Delete Failed');
        return res.redirect('/campgrounds');
    }
    //console.log('Campground Deleted Successfully');
    req.flash('success', 'Campground Deleted Successfully.');
    res.redirect('/campgrounds');
}


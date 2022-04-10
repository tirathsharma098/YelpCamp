const User = require('../models/user');

exports.registerGet = (req, res) => {
    res.render('users/register.ejs');
}

exports.registerPost = async (req, res) => {
    const {username, email, password} = req.body;
    const firstUser = new User({username: username, email:email});
    const userRegistered = await User.register(firstUser, password);
    //console.log(userRegistered);
    req.flash('success', 'User Registered Successfully');
    res.redirect('/campgrounds');
}

exports.loginGet = (req, res) => {
    res.render('users/login.ejs');
}

exports.loginPost = (req, res) => {
    const pathWanted = req.session.pathWanted || '/campgrounds';
    delete req.session.pathWanted;
   req.flash('success', 'User LoggedIn Successfully');
   res.redirect(pathWanted);
}

exports.logoutGet = (req, res) => {
    req.logout();
    req.flash('success', "Good Bye ):");
    res.redirect('/campgrounds');
}
const express = require('express');
const router = express.Router();
const user = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.route('/register')
    .get(user.registerGet)
    .post(catchAsync(user.registerPost))

router.route('/login')
    .get(user.loginGet)
    .post( passport.authenticate('local', {failureFlash : true, failureRedirect: 'login'}), user.loginPost)

router.route('/logout')
    .get(user.logoutGet)

module.exports = router;
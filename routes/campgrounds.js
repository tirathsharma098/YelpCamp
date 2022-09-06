const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

// Instead of nesting all routes in try cath we impliment one function and use it
const catchAsync = require('../utils/catchAsync');
// importing all models
const {validateCampground, authenticateUser, validateCampgroundUser} = require('../middlewares');
const camp = require('../controllers/campgrounds');


router.route('/new')
    .get( authenticateUser, camp.newCampGet)

router.route('/')
    .get(catchAsync(camp.index))
    .post( authenticateUser, upload.array('image'), validateCampground, catchAsync(camp.newCampPost))

router.route('/:id/edit')
    .get( authenticateUser, validateCampgroundUser, catchAsync(camp.campUpdateGet))

router.route('/:id')
    .get(catchAsync(camp.campShow))
    .put( authenticateUser , validateCampgroundUser, upload.array('image'), validateCampground ,catchAsync(camp.campUpdatePut))
    .delete(authenticateUser, validateCampgroundUser, catchAsync(camp.campDelete))


module.exports = router;
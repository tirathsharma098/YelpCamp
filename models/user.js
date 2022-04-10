const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        unique : true,
        required : true
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = model('User', userSchema);
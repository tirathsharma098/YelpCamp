const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title : String,
    image: String,
    price : Number,
    description : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    location : String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(camp){
    if(camp.reviews.length){
        const res = await Review.deleteMany({_id: {$in : camp.reviews}});
        //console.log(res);
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);
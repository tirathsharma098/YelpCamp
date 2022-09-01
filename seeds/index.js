const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')

main().catch(err => console.log('Database Error Occured',err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log('connected to database Successfully.');
}

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for(let i=0; i<50; i++){
        let random1000 = Math.floor(Math.random()*1000);
        let price = Math.floor(Math.random()*50)+20;
        const camp = new Campground({
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            author : '6251acdf301206e4eddf9ca7',
            image : 'https://source.unsplash.com/collection/483251',
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, ipsum aperiam. Minus ratione repudiandae dolor accusamus perferendis laborum eius unde rerum? Dolorum deleniti assumenda explicabo excepturi pariatur quam nulla debitis.',
            price
        })
        await camp.save();
    }
}

seedDB()
    .then( ()=>{
        console.log('Closing the Connection.');
        mongoose.connection.close();
    })
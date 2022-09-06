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
            description : 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, ipsum aperiam. Minus ratione repudiandae dolor accusamus perferendis laborum eius unde rerum? Dolorum deleniti assumenda explicabo excepturi pariatur quam nulla debitis.',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/meandev/image/upload/v1662253333/YelpCamp/yvqy1sboff409y8nn1z0.webp',
                  filename: 'YelpCamp/yvqy1sboff409y8nn1z0'
                },
                {
                  url: 'https://res.cloudinary.com/meandev/image/upload/v1662253334/YelpCamp/bypow5fdaca9qwxciwvv.jpg',
                  filename: 'YelpCamp/bypow5fdaca9qwxciwvv'
                },
                {
                  url: 'https://res.cloudinary.com/meandev/image/upload/v1662253333/YelpCamp/sstuwohexjnvk5scyh3q.jpg',
                  filename: 'YelpCamp/sstuwohexjnvk5scyh3q'
                },
                {
                  url: 'https://res.cloudinary.com/meandev/image/upload/v1662253334/YelpCamp/d6npngpvxb9cu23rwy5q.webp',
                  filename: 'YelpCamp/d6npngpvxb9cu23rwy5q'
                }
              ]
        })
        await camp.save();
    }
}

seedDB()
    .then( ()=>{
        console.log('Closing the Connection.');
        mongoose.connection.close();
    })
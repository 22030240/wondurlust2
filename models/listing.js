//.....................Listing .................................
// title-> title of the flat--> String
// description--> description of the flat--> String
// image(URL)--> link of the image--> String
// price- -  price of the flat-- Number
// location =--- location of the flat-- String
// Country-- country of the flat located -->String

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   url:String,
  filename:String,

  },
  price: Number,
  location: String,
  country: String,
  Reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in: listing.Reviews}});
  }

});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

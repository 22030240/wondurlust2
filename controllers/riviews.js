const { model } = require("mongoose");
const Listing = require("../models/listing");
const Review =require("../models/review");
// crete review
module.exports.createReview= async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    listing.Reviews.push(newreview);
    newreview.author=req.user._id;
    console.log(newreview);
    await newreview.save();
    let as=await listing.save();
    req.flash("success","New Review Created");
    console.log(as);
   res.redirect(`/Listings/${listing._id}`);
};
// delete review
module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{Reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review deleted");
   res.redirect(`/Listings/${id}`);
};
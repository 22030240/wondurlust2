const Listing =require("./models/listing.js");
const Review=require("./models/review.js");
module.exports.isLoggedIn= (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        //* for same path to redirect
        req.session.redirectUrl=req.originalUrl;
        req.flash("error" ," you must be to create listing !");// they show user is login or not
    return    res.redirect("/login");
            }
            next();
}
 //* for same path to redirect........................
module.exports.saveRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
//.............................................
module.exports.isOwner = async(req,res,next)=>{
    let{id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.cur._id)){
req.flash("error","you not a owner  ");
return res.redirect(`/Listings/${id}`);
    }

    next();
};

module.exports.isAuthor = async(req,res,next)=>{
    let{id, reviewId}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.cur._id)){
req.flash("error","you did not delete this review  ");
return res.redirect(`/Listings/${id}`);
    }

    next();
};
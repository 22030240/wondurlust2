const { model } = require("mongoose");
const Listing = require("../models/listing");
const {listingSchema, reviewSchema}=require("../schema.js");
//listings route
module.exports.index = async (req,res) => {
    const allListing=await Listing.find({});
    res.render("index.ejs",{allListing});
 };
// new route
 module.exports.renderNewform = async(req,res)=>{
     res.render("new.ejs");
};
// show route
module.exports.showlistings = async(req,res)=>{
    let{id}= req.params;
 const lis= await  Listing.findById(id).populate({path:"Reviews",
populate:{
    path:"author",
},
}).populate("owner");
 if(!lis){
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/Listings");
 }
 console.log(lis);
 res.render("show.ejs",{lis});

};

// create new route

module.exports.createListings = async (req,res ,next)=>{

   
    let url= req.file.path;
    let filename= req.file.filename;
console.log(url,"..",filename);

    // const result=listingSchema.validate(req.body);
    // console.log(result);
         let {title,description,image,price,location,country}=req.body;
         const newListing= await new Listing({
              title:title,
              description:description,
              image:image,
              price:price,
              location:location,
              country:country
          });
          console.log(req.user);
          newListing.owner=req.user._id;
          newListing.image ={url, filename};
       await  newListing.save();
         req.flash("success","New Listing Created");
            res.redirect("/Listings");
           
       
         
    
 };

 module.exports.renderEditform = async (req,res)=>{
    let{id}= req.params;
 const lis= await  Listing.findById(id);
 if(!lis){
    // flash to flash the message only one time .
    req.flash("error","Listing you requested for does not exist");
    res.redirect("/Listings");
 }

 res.render("edit.ejs" ,{lis });
};

module.exports.updatelisting= async (req,res)=>{
    let{id}= req.params;
   
//     let listing = await Listing.findById(id);
//     if(!listing.owner._id.equals(res.locals.cur._id)){
// req.flash("error","you don't have permission to changes ");
// return res.redirect(`/Listings/${id}`);
//     }
  let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !=="undefined"){
  let url= req.file.path;
  let filename= req.file.filename;
  listing.image={url, filename};
  }
  await listing.save();
  
   // flash to flash the message only one time .
   req.flash("success","Listing updated");
   res.redirect(`/Listings/${id}`);

};

module.exports.deleteListing = async(req,res)=>{
    let{id}= req.params;
  let deletelist=  await Listing.findByIdAndDelete(id);
  //console.log(deletelist);
  req.flash("success"," Listing deleted");
  res.redirect("/Listings");

};

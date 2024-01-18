// const express=require("express");
// const router= express.Router();
// const Listing =require("../models/listing.js");
// const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {listingSchema, reviewSchema}=require("../schema.js");


// //............................. create and show route.....................................
// //listing route
// router.get("/", async(req,res)=>{
//     const allListing=await Listing.find();
//     res.render("index.ejs",{allListing});
//  })
//  //* new route -> for creatings
//  router.get("/new", async(req,res)=>{
//      res.render("new.ejs");
//  })
//  //show route 
//  router.get("/:id", async(req,res)=>{
//      let{id}= req.params;
//   const lis= await  Listing.findById(id).populate("Reviews");
//   res.render("show.ejs",{lis});
     
//  });

//  router.post("/",wrapAsync(async (req,res ,next)=>{
//     const result=listingSchema.validate(req.body);
//     console.log(result);
//          let {title,description,image,price,location,country}=req.body;
//          const newListing= await new Listing({
//               title:title,
//               description:description,
//               image:image,
//               price:price,
//               location:location,
//               country:country
//           });
          
//           newListing.save().then((res)=>{
//               console.log(res);
//           });
//           res.redirect("/Listings");
         
    
//  }));
//  //............................................................................
//  // update listing
//  //edit route
//  router.get("/:id/edit" ,wrapAsync(async (req,res)=>{
//      let{id}= req.params;
//   const lis= await  Listing.findById(id);
//   res.render("edit.ejs" ,{lis});
//  }))
 
//  // update route
//  router.put("/:id" , wrapAsync(async (req,res)=>{
//      let{id}= req.params;
//     const a=await Listing.findByIdAndUpdate(id,{...req.body.listing});
   
//     res.redirect(`/Listings/${id}`);
 
//  }))
//  //.................................... delete route.................................................
//  router.delete("/:id",wrapAsync( async(req,res)=>{
//      let{id}= req.params;
//    let deletelist=  await Listing.findByIdAndDelete(id);
//    //console.log(deletelist);
//    res.redirect("/Listings");
 
//  }));

//  module.exports= router;
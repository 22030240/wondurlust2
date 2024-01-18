const User=require("../models/user.js");
const { model } = require("mongoose");
const Listing = require("../models/listing");
const Review =require("../models/review");
//-------------------------------------------------------------------
module.exports.renderSignup= async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res,next)=>{
    try{
    let {name,username,email,password}=req.body;
    const newUser=new User({name,username,email,password});
   const registerUser=await User.register(newUser,password);
   console.log(registerUser);
   //...................direct login.......................
   req.login(registerUser,(err)=>{
    if(err){
        return next(err);
    }
    //...................................................
    req.flash("success", "user was registered successfully")
   res.redirect("/Listings");
   });
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};
//---------------------------------------------------------------------------------
module.exports.renderLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.Login = async(req,res)=>{
    req.flash("success","you are logged in wonderLust");
    let redirectUrl=res.locals.redirectUrl || "/Listings"// yechyat direct kadi login karayala gelo ter locals undefined yete mhanun he kel
    res.redirect(redirectUrl); //* for same path to redirect

};

module.exports.Logout = (req,res,next)=>{
    req.logOut((err)=>{// req.logOut method is use for logout the system.
        if(err){
           return next(err);
        }
        else{
            req.flash("success"," you are logged out");
            res.redirect("/Listings");
        }
    })
};
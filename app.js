
if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); // karn ki env  file production chya vedes use nhi kart karan tyat aapla data asto 
}



const express=require("express");
const app= express();
const mongoose=require("mongoose"); // mongo db
const Listing =require("./models/listing.js");
app.use(express.urlencoded({extended:true})); // for the id.params
const path=require("path"); // path
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const mongoStore = require("connect-mongo");
const flash=require("connect-flash");
//...............................cloudinary...............................
const {storage}= require("./cloudConfig.js");
//..........................multer...............................
const multer = require('multer');
const upload= multer({storage}) ; // pahile ->{dest:'uploads/'}

//................login any ...............................................
const {isLoggedIn, isOwner,isAuthor}=require("./middleware.js");//        .
const {saveRedirectUrl} =require("./middleware.js");//                    .
//.........................................................................
//.......................controllers.......................................
const listingController = require("./controllers/listings.js");//         .
const reviewController = require("./controllers/riviews.js");//           .
const userController = require("./controllers/users.js");//    
//const DBurl= process.env.ATLASTDB_URL;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected..")
}).catch((err)=>{
    console.log(err);
})

async function main(){
 await mongoose.connect(MONGO_URL);
}
//.........................................................................
//...........................passport Authentication.....................
const passport=require("passport");//                                   :
const LocalStrategy=require("passport-local");  //                      :
const User=require("./models/user.js");//                               :
//.......................................................................

const {listingSchema, reviewSchema}=require("./schema.js");

const Review =require("./models/review.js");

//........................method override package................................
const methodOverride= require("method-override");//                             .
app.use(methodOverride("_method"));//                                           .
//...............................................................................
//..........................................Ejs mate.............................
const ejsmate=require("ejs-mate"); //                                            .                    
app.engine("ejs",ejsmate);   //                                                  .
//................................................................................
//.....................session option.............................................
const store = mongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})  ;
store.on("error" , ()=>{
    console.log("Error mongo" , err);
})
const sessionOptions={ 
    store,                                                        
    secret:process.env.SECRET,//                                                   .
    resave:false, //                                                             .
    saveUninitialized:true,//                                                    .
    cookie:{//                                                                   .
        expires:Date.now() +7*24*60*1000,
        maxAge:7*24*60*1000, //                                                   .                                                    
        httpOnly:true,//                                                          .
    }
}
                                                                             

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize()); //                                                       :
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// generate a function that is use in passport's LocalStrategy.                                :
//..................................................
passport.serializeUser(User.serializeUser());//their are static serializeuser and deserilizeUser of model for passportsession support.
passport.deserializeUser(User.deserializeUser());//:
//...........................mongo db connection ...........................................

//...........................................................................................
// basic route
app.get("/",(req,res)=>{
    res.render("home.ejs");
});

// for session and flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    //console.log(res.locals.success);
    res.locals.cur=req.user;
    next();
})
// hashing algorithm->pbkdf2
// app.get("/demouser",async(req,res)=>{
//     let fakeUser= new User({
//         email:"ajay@gmail.com",
//         name:"ajay",
//         username:"ajay",
//     });
//     let registeruser= await  User.register(fakeUser,"helloworld");//register is convenience method to register a new user instance with given
// console.log(registeruser);
//     res.send(registeruser);
// })

 //............................. create and show route.....................................
 //listing route
app.get("/Listings" , wrapAsync(listingController.index));

//* new route -> for creatings
app.get("/Listings/new", isLoggedIn,listingController.renderNewform);
//show route 
app.get("/Listings/:id",listingController.showlistings );
//* create route ->add listing

// app.post("/Listings",
// isLoggedIn,
//  upload.single("image") ,
//  wrapAsync(listingController.createListings));

app.post("/Listings" ,isLoggedIn, upload.single("image") , wrapAsync(listingController.createListings));

//edit route
app.get("/Listings/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.renderEditform));
// update route
app.put("/Listings/:id" ,isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updatelisting));
//.................................... delete route.................................................
app.delete("/Listings/:id",isLoggedIn,isOwner,wrapAsync( listingController.deleteListing));
//.....................................reviews..direct post rout is create because each data is show itself id...............................
app.post("/Listings/:id/reviews",isLoggedIn,wrapAsync(reviewController.createReview));
// ......................Delete review route..............................
app.delete("/Listings/:id/reviews/:reviewId" ,isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview) );
//.............................................user sign up route...........................
app.get("/signup" ,userController.renderSignup);
app.post("/signup" , userController.signUp);
//......................login................................................................
app.get("/login" , userController.renderLogin);
app.post("/login" ,saveRedirectUrl, passport.authenticate("local" , {failureRedirect:"/login",failureFlash:true}),userController.Login);
//.........................logout.............................................................
app.get("/logout",userController.Logout);
// middleware
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
app.use((err,req,res, next)=>{
    let{status=500,message="someone went wrong"}=err;
    res.render("error.ejs",{err});
   // res.status(status).send(message);
    
})
app.listen(1000,()=>{
    console.log("server is on..");  // for  express
});
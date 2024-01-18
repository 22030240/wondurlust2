const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    }

});
//mongoose passport mad username and password automatic save Hot.
userSchema.plugin(passportLocalMongoose);// for implementing passport local mongoose.
module.exports=mongoose.model("User",userSchema);
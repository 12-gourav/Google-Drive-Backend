import mongoose from "mongoose";


const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    age:String,
    gender:String,
    contact:{
        type:String,
        require:true,
        unique:true
    },
    address:String,
    dob:String,
    pic:Array,
    subuser:[
        {
     type:ObjectId,
     ref:"SubUser"
        }
    ],
    role:{
        type:String,
        default:"user"
    },
    verified:{
        type:Boolean,
        default:false
    },
    otp:Number,
    otp_expiary:Date,
    resetPasswordOtp:Number,
    resetPasswordOtpExpiary:Date,

},{timestamps:true});



export const User = mongoose.model("User",userSchema);
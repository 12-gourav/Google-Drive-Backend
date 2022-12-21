import mongoose from "mongoose";


const {ObjectId} = mongoose.Schema;

const userSchema = new mongoose.Schema({

    name:{
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
    email:{
        type:String,
        require:true,
        unique:true
    },
    address:String,
    userId:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true,
        maxlength:[10,"Password to Long"],
        minlength:[6,"Password To Short"]
    },
    dob:String,
    pic:Array,
    storage:[
        {
            title:String,
            public_id:String,
            url:String,
            fileSize:String,
        }
    ],
    videos:[
        {
            title:String,
            public_id:String,
            url:String,
            type1:String,
            fileSize:String,

        }
    ],
    docs:[
        {
            title:String,
            public_id:String,
            url:String,
            type1:String,
            fileSize:String,
            
        }
    ],
    role:{
        type:String,
        default:"subuser"
    },
    maxlimit:{
        type:String,
       
    },
    existlimit:{
        type:String,
        default:0
    }

},{timestamps:true});



export const SubUser = mongoose.model("SubUser",userSchema);
import { User } from "../Models/User.js";
import {SubUser} from "../Models/SubUser.js"
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { Feedback } from "../Models/FeedBacks.js";



/// register User
export const RegisterUser = async (req,res)=>{
try {
   
    const {name,email,password,age,gender,contact,address,dob} = req.body;
   
    const profile = req.files.pic;
    const result = await cloudinary.v2.uploader.upload(profile.tempFilePath,{
        folder:"dum",
    });

const real = {
public_id:result.public_id,
url:result.url
}



    console.log(result);
    profile.mv(`uploads/${profile.name}`,(err)=>{
        // ${path.extname(profile.name)}
        if(err){
            console.log(err);
            return res.status(500).send(err);
        }
       
    });
    const filename = `uploads/${profile.name}`;

 
    const existUser = await User.findOne({email:email.toLowerCase()});
    if(existUser){
        return res.status(400).json({error:"User Already exist ! Plz check your Email Address.."})
    }
    

    ///hashing our password
    const encryptPassword = await bcrypt.hash(password,10);

    const data = await User.create({name,email:email.toLowerCase(),password:encryptPassword,
        age,gender,contact,address,dob,pic:real});


    if(data){
    
        /// created jsonwebToken......
       const token = Jwt.sign({
             userId:data._id,
               email:data.email
          },process.env.JWT_SECRET,{
             expiresIn:"24h"
          });

          res.status(201).json({message:"User Register successFully",data:data,token:token});
    }


} catch (error) {
    res.status(500).json({error:error});
    console.log(error);
}
}

///Register Sub Users

export const RegisterSuBUser = async (req,res)=>{
    try {


        const {name,age,gender,contact,email,address,userId,password,dob,storage} = req.body;
        const profile = req.files.pic;
        console.log(req.files);
        console.log(req.body);
        const result = await cloudinary.v2.uploader.upload(profile.tempFilePath,{
            folder:"dum",
        });

const real = {
    public_id:result.public_id,
    url:result.url
}



        console.log(result);
        profile.mv(`uploads/${profile.name}`,(err)=>{
            // ${path.extname(profile.name)}
            if(err){
                console.log(err);
                return res.status(500).send(err);
            }
           
        });
        const filename = `uploads/${profile.name}`;
        const filePath = `${req.protocol}://${req.get("host")}/${filename}`;
        console.log(filePath);
  
        const existUser = await SubUser.findOne({email:email});
               if(existUser){
                 return res.status(400).json({error:"Sub User or User Id already exist .."});
                 }
        const data = await SubUser.create({name,age,gender,contact,email,address,userId,password,dob,pic:real,maxlimit:storage});
        const data2 = await User.findByIdAndUpdate({_id:req.user._id},{$push:{subuser:data._id}},{new:true});
        if(data && data2){
            return res.status(201).json({message:"Sub User Register successFully :)"});
        }

    } catch (error) {
        return res.status(400).json({error:error});
    }
}


////Login Sub User 

export const Login = async (req,res)=>{
    try {
        const {email,password,role} = req.body;
        
        if(role === "user"){

         const userExist = await User.findOne({email});
          if(!userExist) return res.status(400).json({error:"User Does Not exist"});

          const check = await bcrypt.compare(password,userExist.password);
          console.log(check);
          if(!check){
        return res.status(400).json({error:"Invalid Credintials..."});
          }
       /// everthing is ok
       /// created jsonwebToken......
       const token = Jwt.sign({
        userId:userExist._id,
          email:userExist.email
     },process.env.JWT_SECRET,{
        expiresIn:"24h"
     });
       return res.status(200).json({message:"Login successFully",data:{data:userExist,token:token}});

        }
        else{
            const userExist = await SubUser.findOne({email});
            if(!userExist) return res.status(400).json({error:" Sub User Does Not exist"});
  
            const check = bcrypt.compare(password,userExist.password);
            if(!check){
          return res.status(400).json({error:"Invalid Credintials..."});
            }
         /// everthing is ok
       /// created jsonwebToken......
       const token = Jwt.sign({
        userId:userExist._id,
          email:userExist.email,
          role:userExist.role,
     },process.env.JWT_SECRET,{
        expiresIn:"24h"
     });
       return res.status(200).json({message:"Login successFully",data:{data:userExist,token:token}});
        }

    } catch (error) {
        return res.status(400).json({error:error});
    }
}



export const loadUser = async (req,res)=>{
    try {
        if(req.role==="subuser"){
          const data = await SubUser.findOne({email:req.email});
            if(data){
                return res.status(200).json({data:data,token:req.token});
                }
        }
        else{
            const data = await User.findOne({_id:req.user._id}).populate("subuser");
            if(data){
                return res.status(200).json({data:data,token:req.token});
                }
        }
       
       
        return res.status(400).json({error:"Unauthorized User"});
        
    } catch (error) {
        return res.status(400).json({error:error});
    }
}


export const updateSubUserProfile = async (req,res)=>{
    try {
        const {id,name,email,password,contact} = req.body;

        const user = await SubUser.findByIdAndUpdate({_id:id},{name,email,password,contact});
        if(user){
            return res.status(201).json({message:"User Update Successfully"});
        }
        
    } catch (error) {
        return res.status(400).json({error:error});
    }
}

export const deleteSubUser = async (req,res)=>{
    try {
        const {id} = req.body;

        const user = await SubUser.findByIdAndDelete({_id:id});
        if(user){
            return res.status(201).json({message:"User Deleted Successfully"});
        }
        
    } catch (error) {
        return res.status(400).json({error:error});
    }
}

export const deleteSubUserProfile = async (req,res)=>{
    try {
        const {id} = req.body;
        console.log(id);

        const user = await SubUser.findByIdAndDelete({_id:id});
        const mainuser = await User.findByIdAndDelete({_id:req.user._id},{subuser:id});
        if(user && mainuser){
            return res.status(201).json({message:"User Delete Successfully"});
        }
        
    } catch (error) {
        return res.status(400).json({error:error});
    }
}

export const logout = async(req,res)=>{
    try {
        res.status(200).json({success:true,message:"Logout Successfully"});
 
         
     } catch (error) {
         console.log(error);
         res.status(500).json({success:false,message:error.message});
     }
}


////media sections

export const uploadMedia = async (req,res)=>{
    try {

        const {title,limit,fileSize} = req.body;
console.log(req.id);
        const profile = req.files.images;
        console.log(req.files);
        console.log(req.body);
        const result = await cloudinary.v2.uploader.upload(profile.tempFilePath,{
            folder:"dum",
        });

                const real = {
                 public_id:result.public_id,
                 url:result.url
            }
            console.log(result);
            profile.mv(`uploads/${profile.name}`,(err)=>{
                // ${path.extname(profile.name)}
                if(err){
                    console.log(err);
                    return res.status(500).send(err);
                }
               
            });
            const filename = `uploads/${profile.name}`;
            const filePath = `${req.protocol}://${req.get("host")}/${filename}`;
            console.log(filePath);

         
        const data = await SubUser.findByIdAndUpdate({_id:req.id},
            {$push:{storage:{title,public_id:real.public_id,url:real.url,fileSize}}
            ,title:title,existlimit:limit}
            ,{new:true});
            
         res.status(201).json({message:"Media Uploaded Successfully",data:data});
        
    } catch (error) {
        res.status(400).json({message:"Image upload Failed",error:error})
        console.log(error);
    }
}

export const removeMedia = async (req,res)=>{
    try {
        const {picid,public_id,limit} = req.body;
        console.log(public_id);
        const result = await cloudinary.v2.uploader.destroy(public_id);

        const data = await SubUser.findByIdAndUpdate({_id:req.id},{$pull:{storage:{_id:picid}}});
        const data2 = await SubUser.findByIdAndUpdate({_id:req.id},{existlimit:limit},{new:true});

        if(data){
            res.status(201).json({data:data,message:"Images Deleted SuccessFully"})
        }


        
    } catch (error) {
        res.status(400).json({message:"Image Deletion Failed",error:error})
        console.log(error);
    }
}


export const uploadVideo = async (req,res)=>{
    try {
        const {public_id,url,type,title,limit,fileSize} = req.body;

        const data = await SubUser.findByIdAndUpdate({_id:req.id},
            {$push:{videos:{title,public_id:public_id,url:url,type1:type,fileSize:fileSize}}
            ,existlimit:limit}
            ,{new:true});
            
         res.status(201).json({message:"Media Uploaded Successfully",data:data});
        
    } catch (error) {
        res.status(400).json({message:"Image Deletion Failed",error:error})
        console.log(error);
    }
}

export const removeVideo = async (req,res)=>{
    try {
        const {picid,public_id,limit} = req.body;
        console.log(public_id);
        const result = await cloudinary.v2.uploader.destroy(public_id);

        const data = await SubUser.findByIdAndUpdate({_id:req.id},{$pull:{videos:{_id:picid}}});
        const data2 = await SubUser.findByIdAndUpdate({_id:req.id},{existlimit:limit},{new:true});

        if(data){
            res.status(201).json({data:data,message:"Images Deleted SuccessFully"})
        }


        
    } catch (error) {
        res.status(400).json({message:"Image Deletion Failed",error:error})
        console.log(error);
    }
}


export const uploadDocs = async (req,res)=>{
    try {
        const {public_id,url,type,title,limit,fileSize} = req.body;

        const data = await SubUser.findByIdAndUpdate({_id:req.id},
            {$push:{docs:{title,public_id:public_id,url:url,type1:type,fileSize:fileSize}}
            ,existlimit:limit}
            ,{new:true});
            
         res.status(201).json({message:"Media Uploaded Successfully",data:data});
        
    } catch (error) {
        res.status(400).json({message:"Image Deletion Failed",error:error})
        console.log(error);
    }
}

export const removeDocs = async (req,res)=>{
    try {
        const {picid,public_id,limit} = req.body;
        console.log(public_id);
        const result = await cloudinary.v2.uploader.destroy(public_id);

        const data = await SubUser.findByIdAndUpdate({_id:req.id},{$pull:{docs:{_id:picid}}});
        const data2 = await SubUser.findByIdAndUpdate({_id:req.id},{existlimit:limit},{new:true});

        if(data){
            res.status(201).json({data:data,message:"Images Deleted SuccessFully"})
        }


        
    } catch (error) {
        res.status(400).json({message:"Image Deletion Failed",error:error})
        console.log(error);
    }
}


/////FeedBacks


export const CreateFeedback = async(req,res)=>{
    try {
        const {id,name,feedback,avtar} = req.body;
        const exist_user = await Feedback.findOne({id:id});
        if(exist_user){
            const data = await Feedback.findByIdAndUpdate({_id:exist_user._id},{id,name,comment:feedback,avtar});
            return res.status(200).json({message:"Your FeedBack is Updated .Thank you :)",data:data});
        }
        const data2 = await Feedback.create({id,name,comment:feedback,avtar});
        return res.status(200).json({message:"Your FeedBack is Saved .Thank you :)",data:data2});
        
    } catch (error) {
        res.status(400).json({message:"Something went wrong",error:error})
        console.log(error);
    }
}

export const GetFeedback = async(req,res)=>{
    try {
        const data = await Feedback.find().limit(5).sort({createdAt:-1});
        res.status(200).json({data:data});
    } catch (error) {
        res.status(400).json({message:"Something went wrong",error:error})
        console.log(error);
    }
}
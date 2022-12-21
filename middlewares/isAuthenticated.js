import JWT from "jsonwebtoken";
import { User } from "../Models/User.js";


export const isAuthenticated = async(req,res,next)=>{
    try {
    //    console.log(req.headers.authtoken);
        const token =  req.headers.token;
        // console.log(token);

        if(!token){
            return res.status(400).json({error:"Login First"});

        }
const decoded = JWT.verify(token,process.env.JWT_SECRET);
 req.user = await User.findById(decoded.userId);
 req.token=token;
 req.role=decoded.role;
 req.email=decoded.email;
 console.log(decoded);
 req.id=decoded.userId;
//  console.log(req.user._id);


next();

    } catch (error) {
        res.status(401).json({success:false,message:error.message});
        console.log(error);
    }
}
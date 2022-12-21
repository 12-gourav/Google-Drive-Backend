import express from "express";
import { config } from "dotenv";
import cors from "cors";
import {database} from "./config/Database.js";
import userRouter from "./Routes/User.js";
import bodyParser  from "body-parser";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import path from "path";
import { dirname } from "path";

///initialize path for dotenv config
config({
    path:"./.env"
})

//initilize the app
const app = express();
const PORT = process.env.PORT || PORT;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
//Database Connections
database();

///apply middlewares

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(fileUpload({
    debug:true,
    useTempFiles:true,
    tempFileDir:path.join(dirname("temp")),
}));
app.use(express.static("uploads"));

app.use("/api/v1",userRouter);

//routes

app.get("/",(req,res)=>{
    res.status(200).json({message:"Server is running perfectly ok :)"});
});



app.listen(PORT,()=>{
    console.log(`Server is running on PORT NO ${PORT}`);
})


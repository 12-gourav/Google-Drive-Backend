import mongoose from "mongoose";



   export const database = ()=>{
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB).then(()=>{
        console.log("DataBase is connected Successfullly");
    }).catch((err)=>{
        console.log(err)
    })
   } 




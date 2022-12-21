import mongoose from "mongoose";

const feedbackSchema = mongoose.Schema({
    name:String,
    comment:String,
    id:String,
    avtar:String,
},{timestamps:true});

export const Feedback = mongoose.model("Feedbacks",feedbackSchema);
import mongoose, { Schema } from "mongoose";
import { Question } from "./question-model";

const interviewSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    domain:{
        type:String,
        required: true
    },
    Questions: [String],
    userResponse: [string],
    aiResponse: [String],

    score:{
        type:Schema.Types.ObjectId,
        ref:"Score",
        required: true
    }
})

export const Interview = mongoose.model("Interview", interviewSchema)
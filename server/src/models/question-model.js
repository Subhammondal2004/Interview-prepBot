import mongoose, { Schema } from "mongoose"

const questionSchema = new Schema({
    domain:{
        type:String,
        required: true,
        enum: ["Web Development", "Data Structures", "HR", "Database", "Operating Systems" ]
    },
    difficulty:{
        type:String,
        required: true,
        enum: ["Easy", "Medium", "Hard"]
    },
    questionText:{
        type:String,
        required: true
    },
    answerKey:{
        type: String,
    },
    tags:{
        type:[String],
        default: []
    }
    
}, { timestamps: true })

export const Question = mongoose.model("Question", questionSchema)
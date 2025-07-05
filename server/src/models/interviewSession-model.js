import mongoose, { Schema } from "mongoose";

const responseSchema = new Schema({
    questionId:{
        type: Schema.Types.ObjectId,
        ref:"Question"
    },
    userResponse:{
        type:String,
        required: true
    },
    aiResponse:{
        type:String
    },
    isCorrect:{
        type: Boolean,
        default: false
    }
},{ timestamps: true})

const interviewSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    domain:{
        type:String,
        required: true
    },
    difficulty:{
        type:String,
        required:true
    },
    questions:[responseSchema],
    score:{
        type:Schema.Types.ObjectId,
        ref:"Score",
        required: true
    },
    isSubmitted:{
        type: Boolean,
        default: false
    },
    startTime:{
        type: Date,
        default: Date.now()
    },
    endTime:{
        type: Date
    }
})

export const Interview = mongoose.model("Interview", interviewSchema)
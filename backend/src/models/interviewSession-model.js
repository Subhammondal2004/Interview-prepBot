import mongoose, { Schema } from "mongoose";

const responseSchema = new Schema({
    questionId:{
        type: Schema.Types.ObjectId,
        ref:"Question"
    },
    questionText:{
        type: String
    },
    userResponse:{
        type:String,
    },
    aiResponse:{
        type:String
    },
    isCorrect:{
        type: Boolean,
        default: false
    },
    feedback:{
        type: String
    },
    score:{
        type: Number,
        default: 0
    }
})

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
        type: Number,
        required: true,
        default: 0
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
    },
    duration:{
        type:Number,
        default: 0
    }
})

export const Interview = mongoose.model("Interview", interviewSchema)
import mongoose, {Schema} from "mongoose"

const scoreSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    score:{
        type:Number,
        required: true,
        default: 0
    },
    domain:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
},{timestamps : true})

export const Score = mongoose.model("Score",scoreSchema)
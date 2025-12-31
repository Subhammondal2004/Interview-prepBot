import { Question } from "../models/question-model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const questionSet = asyncHandler(async(req, res)=>{
    const { domain, difficulty } = req.params;

    if([domain, difficulty].some((field)=> field?.trim === "")){
        throw new apiError(400, "All fields are required!")
    }

    const allowedDomain = await Question.schema.path('domain').enumValues
    const allowedDifficulty = await Question.schema.path('difficulty').enumValues

    if(!(allowedDomain.includes(domain) || allowedDifficulty.includes(difficulty))){
        throw new apiError(400, "Invalid fields!")
    }

    const data = await Question.find({
        domain,
        difficulty
    }).select(" -answerKey -createdAt -updatedAt")

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            data,
            "Questions fetched successfully!!"
        )
    )

})

// const getNextQues =  asyncHandler (async (req, res) =>{

// })

export{
    questionSet
}
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

const getQuestions = asyncHandler(async(req, res)=>{
    const { domain } = req.params;
    if(!domain){
        throw new apiError(400, "All fields are required!")
    }

    const question = await Question.find({ domain });
    const totalquestion = question.length;

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            { question, totalquestion },
            "Questions fetched successfully!!"
        )
    )
})

const createQuestion = asyncHandler(async(req, res)=>{
    const { domain, difficulty, question, answerKey } = req.body;
    const user = req.user;

    if([domain, difficulty, question, answerKey].some((field)=> field?.trim() === "")){
        throw new apiError(400, "All fields are required!")
    }
    if(!user){
        throw new apiError(404, "Unauthorized!")
    }

    const quesCreated = await Question.create({
        domain,
        difficulty,
        questionText: question,
        answerKey,
        userId: user._id
    })

    return res
    .status(201)
    .json(
        new apiResponse(
            201,
            quesCreated,
            "Question created successfully!"
        )
    )
})

const getQuestionsOfUser = asyncHandler(async(req, res)=>{
    const userId = req.user._id;
    const questions = await Question.find({ userId });

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            questions,
            "Questions fetched successfully!"
        )
    )
})

const deleteQuestion = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    if(!id){
        throw new apiError(400, "ID of Question required!")
    }

    await Question.findByIdAndDelete(id);

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            [],
            "Question deleted by ID!"
        )
    )
})

const editQuestion = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const { questionText, answerKey } = req.body;
    if([questionText, answerKey].some((field)=> field?.trim() === "")){
        throw new apiError(400, "All fields are required!")
    }
    if(!id){
        throw new apiError(400, "ID required to edit")
    }

    const editQuestion = await Question.findByIdAndUpdate(
        {_id: id } ,
        {
            $set:{
                questionText,
                answerKey
            }
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            editQuestion,
            "Question eddited successfully!"
        )
    )
})

export{
    questionSet,
    getQuestions,
    createQuestion,
    getQuestionsOfUser,
    deleteQuestion,
    editQuestion
}
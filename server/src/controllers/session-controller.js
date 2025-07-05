import { Interview } from "../models/interviewSession-model.js";
import { Question } from "../models/question-model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Schema } from "mongoose";


const startInterviewSession = asyncHandler(async (req, res) => {
    const { userId, domain, difficulty } = req.body;

    if ([userId, domain, difficulty].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required!")
    }

    const allowedDomain = await Question.schema.path('domain').enumValues
    const allowedDifficulty = await Question.schema.path('difficulty').enumValues

    if (!(allowedDomain.includes(domain) || allowedDifficulty.includes(difficulty))) {
        throw new apiError(400, "Invalid fields!")
    }

    const questions = await Question.aggregate([
        {
            $match: {
                domain,
                difficulty
            }
        },
        {
            $sample: {
                size: 5
            }
        }
    ])

    const sessionCreated = await Interview.create({
        userId,
        domain,
        difficulty,
        questions: questions.map(q => q?._id),
        startTime: new Date()
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    sessionCreated, questions
                },
                "Session started successfully!!!"
            )
        )
})

const submitInterviewSession = asyncHandler(async (req, res) => {
    const { sessionId, answers } = req.body;

    if ([sessionId, answers].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required")
    }

    const answerStored = [];

    for (const ans of answers) {
        answerStored.push({
            questionId: ans?._questionId,
            userResponse: ans?.userResponse
        })
    }

    const submittedSession = await Interview.findByIdAndUpdate(
        sessionId,
        {
            $set: {
                questions: answerStored,
                isSubmitted: true,
                endTime: new Date()
            }
        },
        {
            new: true
        }
    )

    //TODOS: ai evaulation is required

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                [],
                "Session submitted successfully!!!"
            )
        )
})

const getInterviewSessionById = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        throw new apiError(400, "Id is required to fetch session details")
    }

    const session = await Interview.findById(sessionId)

    if (!session) {
        throw new apiError(400, "No such session conducted !!")
    }

    const interviewSession = await Interview.aggregate([
        {
            $match: {
                _id: Schema.Types.ObjectId(sessionId)
            }
        },
        {
            $unwind: "$questions"
        },
        {
            $lookup: {
                from: "questions",
                localField: "questions.questionId",
                foreignField: "_id",
                as: "questionsData"
            }
        },
        {
            $unwind: "$questionsData"
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "User",
                pipeline: [
                    {
                        $project: {
                            username: 1
                        }
                    },
                ]
            }
        },
        {
            $group: {
                userId: {
                    $first: "$_id"
                },
                domain:{
                    $first: "$domain"
                },
                difficulty:{
                    $first: "$difficulty"
                },
                questions:{
                    $push:{
                        questionId: "$questions.questionData",
                        userResponse: "$questions.userResponse"
                    }
                },
                isSubmitted:{
                    $first: "$isSubmitted"
                }
            }
        },
        {
            $addFields:{
                username:{
                    $first: "$username"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            interviewSession,
            "Interview Session fetched successfully!!!"
        )
    )
})

const getAllSessionForUser = asyncHandler(async (req, res) => {

})

export {
    startInterviewSession,
    submitInterviewSession,
    getInterviewSessionById,
    getAllSessionForUser
}
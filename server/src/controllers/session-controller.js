import { Interview } from "../models/interviewSession-model.js";
import { Question } from "../models/question-model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Schema } from "mongoose";
import { evaulateAnswersAi } from "./ai-controller.js";


const startInterviewSession = asyncHandler(async (req, res) => {
    const { domain, difficulty } = req.body;
    const userId = req.user?._id;

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
        },
        {
            $project: {
                questionText: 1,
                domain: 1,
                difficulty: 1,
            }
        }
    ])

    const sessionCreated = await Interview.create({
        userId,
        domain,
        difficulty,
        questions: questions.map((question) => ({
            questionId: question?._id,
        })),
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
            questionId: ans?.questionId,
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

    let score = 0;
    const evaluatedAnswers = [];

    for (const question of submittedSession.questions) {
        const questionData = await Question.findById(question.questionId);
        if (!questionData) {
            throw new apiError(400, "Invalid question ID in answers");
        }
        const evaluation = await evaulateAnswersAi(
            questionData.questionText,
            question.userResponse,
            questionData.answerKey
        );

        console.log(evaluation);

        evaluatedAnswers.push({
            questionId: question.questionId,
            userResponse: question.userResponse,
            aiResponse: evaluation.message.aiResponse,
            isCorrect:evaluation.message.score >= 3, // Assuming score >= 3 is considered correct
            feedback: evaluation.message.feedback
        });
        score += evaluation.message.score; // Accumulate the score
    }
    submittedSession.questions = evaluatedAnswers;
    submittedSession.score = score;
    submittedSession.duration = (submittedSession.endTime - submittedSession.startTime)/(1000*60);
    await submittedSession.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    submittedSession,
                },
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
                domain: {
                    $first: "$domain"
                },
                difficulty: {
                    $first: "$difficulty"
                },
                questions: {
                    $push: {
                        questionId: "$questions.questionData",
                        userResponse: "$questions.userResponse"
                    }
                },
                isSubmitted: {
                    $first: "$isSubmitted"
                }
            }
        },
        {
            $addFields: {
                username: {
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

// const getAllSessionForUser = asyncHandler(async (req, res) => {

// })

export {
    startInterviewSession,
    submitInterviewSession,
    getInterviewSessionById,
    // getAllSessionForUser
}
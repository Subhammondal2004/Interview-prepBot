import { Interview } from "../models/interviewSession-model.js";
import { Question } from "../models/question-model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import mongoose, { Schema } from "mongoose";
import { evaulateAnswersAi } from "./ai-controller.js";

const startInterviewSession = asyncHandler(async (req, res) => {
  const { domain, difficulty } = req.body;
  const userId = req.user?._id;

  if ([userId, domain, difficulty].some((field) => field?.trim === "")) {
    throw new apiError(400, "All fields are required!");
  }

  const allowedDomain = await Question.schema.path("domain").enumValues;
  const allowedDifficulty = await Question.schema.path("difficulty").enumValues;

  if (
    !(allowedDomain.includes(domain) || allowedDifficulty.includes(difficulty))
  ) {
    throw new apiError(400, "Invalid fields!");
  }

  const questions = await Question.aggregate([
    {
      $match: {
        domain,
        difficulty,
      },
    },
    {
      $sample: {
        size: 5,
      },
    },
    {
      $project: {
        questionText: 1,
        domain: 1,
        difficulty: 1,
        answerKey: 1,
      },
    },
  ]);

  const sessionCreated = await Interview.create({
    userId,
    domain,
    difficulty,
    questions: questions.map((question) => ({
      questionId: question?._id,
    })),
    startTime: new Date(),
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        sessionCreated,
        questions,
      },
      "Session started successfully!!!"
    )
  );
});

const submitInterviewSession = asyncHandler(async (req, res) => {
  const { sessionId, answers } = req.body;

  if ([sessionId, answers].some((field) => field?.trim === "")) {
    throw new apiError(400, "All fields are required");
  }

  const answerStored = [];

  for (const ans of answers) {
    answerStored.push({
      questionId: ans?.questionId,
      userResponse: ans?.userResponse,
    });
  }

  const submittedSession = await Interview.findByIdAndUpdate(
    sessionId,
    {
      $set: {
        questions: answerStored,
        isSubmitted: true,
        endTime: new Date(),
      },
    },
    {
      new: true,
    }
  );

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

    evaluatedAnswers.push({
      questionId: question.questionId,
      questionText: questionData.questionText,
      userResponse: question.userResponse,
      aiResponse: evaluation.message.aiResponse,
      isCorrect: evaluation.message.score >= 3, // Assuming score >= 3 is considered correct
      feedback: evaluation.message.feedback,
      score: evaluation.message.score,
    });
    score += evaluation.message.score; // Accumulate the score
  }
  submittedSession.questions = evaluatedAnswers;
  submittedSession.score = score;
  submittedSession.duration =
    (submittedSession.endTime - submittedSession.startTime) / (1000 * 60);
  await submittedSession.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        submittedSession,
        "Session submitted successfully!!!"
      )
    );
});

const getInterviewSessionById = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    throw new apiError(400, "Id is required to fetch session details");
  }

  const session = await Interview.findById(sessionId);

  if (!session) {
    throw new apiError(400, "No such session conducted !!");
  }

  const interviewSession = await Interview.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(sessionId),
      },
    },
    {
      $unwind: "$questions",
    },
    {
      $lookup: {
        from: "questions",
        localField: "questions.questionId",
        foreignField: "_id",
        as: "questionsData",
      },
    },
    {
      $unwind: "$questionsData",
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
              username: 1,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "$_id",
        userId: {
          $first: "$_id",
        },
        domain: {
          $first: "$domain",
        },
        difficulty: {
          $first: "$difficulty",
        },
        questions: {
          $push: {
            questionId: "$questions.questionId",
            questionText: "$questions.questionText",
            userResponse: "$questions.userResponse",
            aiResponse: "$questions.aiResponse",
            feedback: "$questions.feedback",
            isCorrect: "$questions.isCorrect",
            score: "$questions.score",
          },
        },
        isSubmitted: {
          $first: "$isSubmitted",
        },
        score: {
          $first: "$score",
        },
        startTime: {
          $first: "$startTime",
        },
        endTime: {
          $first: "$endTime",
        },
        duration: {
          $first: "$duration",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        interviewSession,
        "Interview Session fetched successfully!!!"
      )
    );
});

const getAllSessionDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new apiError(400, "User ID is required");
  }

  const sessions = await Interview.find({ userId });

  const uniqueQuestionIds = new Set();
  let totalScore = 0;
  let totalQs = 0;

  const domainStats = {};

  sessions.forEach((session) => {
    if (!session.isSubmitted) return;

    const domain = session.domain || "Unknown";
    const questionCount = session.questions.length;

    totalQs += questionCount;
    totalScore += session.score;

    session.questions.forEach((q) => {
      if (q.questionId) {
        uniqueQuestionIds.add(q.questionId.toString());
      }
    });

    if (!domainStats[domain]) {
      domainStats[domain] = {
        totalScore: 0,
        totalQuestions: 0,
      };
    }

    domainStats[domain].totalScore += session.score;
    domainStats[domain].totalQuestions += questionCount;
  });

  let bestDomain = null;
  let bestDomainScore = 0;

  const domainAvgScore = Object.entries(domainStats).map(([domain, stats]) => {
    const percentage =
      stats.totalQuestions > 0
        ? Number(
            ((stats.totalScore / (stats.totalQuestions * 10)) * 100).toFixed(1)
          )
        : 0;

    // find best domain
    if (percentage > bestDomainScore) {
      bestDomainScore = percentage;
      bestDomain = domain;
    }

    return {
      domain,
      score: percentage,
      totalQuestions: stats.totalQuestions,
    };
  });

  const totalSessions = sessions.filter((s) => s.isSubmitted).length;
  const totalQuestions = totalQs;

  const overallScore =
    totalQs > 0 ? Number((totalScore / (totalQs * 10)) * 100).toFixed(1) : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSessions,
        totalQuestions,
        overallScore,
        bestDomain: bestDomain
          ? {
              domain: bestDomain,
              score: bestDomainScore,
            }
          : null,
        domainAvgScore,
      },
      "Sessions fetched successfully!!!"
    )
  );
});

const getAllUserSessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw new apiError(400, "User need to Login or require vaild ID!");
  }

  const sessions = await Interview.find({ userId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, sessions, "All user sessions fetched successfully!")
    );
});

const getMonthlySessionDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new apiError(400, "User ID is required");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const sessions = await Interview.find({
    userId,
    startTime: {
      $gte: startOfMonth,
      $lt: startOfNextMonth,
    },
  });

  const uniqueQuestionIds = new Set();
  let totalScore = 0;
  let totalQs = 0;
  let totalSessions = 0;

  const domainStats = {};

  sessions.forEach((session) => {
    if (!session.isSubmitted) return;

    totalSessions++;

    const domain = session.domain || "Unknown";
    const questionCount = session.questions.length;

    totalQs += questionCount;
    totalScore += session.score;

    session.questions.forEach((q) => {
      if (q.questionId) {
        uniqueQuestionIds.add(q.questionId.toString());
      }
    });

    if (!domainStats[domain]) {
      domainStats[domain] = {
        totalScore: 0,
        totalQuestions: 0,
      };
    }

    domainStats[domain].totalScore += session.score;
    domainStats[domain].totalQuestions += questionCount;
  });

  // 📊 Domain-wise average
  const domainAvgScore = Object.entries(domainStats).map(([domain, stats]) => ({
    domain,
    avgScore:
      stats.totalQuestions > 0
        ? Number(
            (stats.totalScore / (stats.totalQuestions * 10)) * 100
          ).toFixed(1)
        : "0.0",
  }));

  const totalQuestions = uniqueQuestionIds.size;

  const avgScore =
    totalQs > 0
      ? Number((totalScore / (totalQs * 10)) * 100).toFixed(1)
      : "0.0";

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        month: now.toLocaleString("default", { month: "long" }),
        year: now.getFullYear(),
        totalSessions,
        totalQuestions,
        avgScore,
        domainAvgScore,
      },
      "Current month session analytics fetched successfully"
    )
  );
});

const getMonthlyLeaderboard = asyncHandler(async (req, res) => {
  let { year, month } = req.query;

  const user = req.user;
  const now = new Date();
  year = year ? Number(year) : now.getFullYear();
  month = month ? Number(month) : now.getMonth() + 1;

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const leaderboard = await Interview.aggregate([
    {
      $match: {
        isSubmitted: true,
        startTime: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: "$userId",
        totalScore: { $sum: "$score" },
        totalQuestions: { $sum: { $size: "$questions" } },
        sessionDates: { $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } } },
      },
    },
    {
      $addFields: {
        streak: {
          $size: "$sessionDates",
        },
      },
    },
    {
      $addFields: {
        percentage: {
          $cond: [
            { $gt: ["$totalQuestions", 0] },
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalScore", { $multiply: ["$totalQuestions", 10] }] },
                    100,
                  ],
                },
                1,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $sort: {
        totalScore: -1,
        streak: -1,
      },
    },
  ]);

  let rank = 1;
  let prevScore = null;
  let prevStreak = null;

  const rankedLeaderboard = leaderboard.map((item, index) => {
    if (
      prevScore !== null &&
      (item.totalScore !== prevScore || item.streak !== prevStreak)
    ) {
      rank = index + 1;
    }

    prevScore = item.totalScore;
    prevStreak = item.streak;

    return {
      rank,
      userId: item._id,
      username: item.user.username,
      totalScore: item.totalScore,
      totalQuestions: item.totalQuestions,
      streak: item.streak,
      percentage: item.percentage,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        month: {
          year:`${year}`,
          month: `${String(month).padStart(2, "0")}`
        },
        leaderboard: rankedLeaderboard,
        user
      },
      "Monthly leaderboard fetched successfully"
    )
  );
});


export {
  startInterviewSession,
  submitInterviewSession,
  getInterviewSessionById,
  getAllSessionDetails,
  getAllUserSessions,
  getMonthlySessionDetails,
  getMonthlyLeaderboard
};

import express from "express";
import {
    startInterviewSession,
    submitInterviewSession,
    getInterviewSessionById,
    getAllSessionDetails,
    getAllUserSessions,
    getMonthlySessionDetails,
    getMonthlyLeaderboard
} from "../controllers/session-controller.js";
import { verifyjwt } from "../middlewares/auth-middleware.js";

const router = express.Router()

router.route("/start-session").post(verifyjwt, startInterviewSession)
router.route("/submit").post(verifyjwt, submitInterviewSession)
router.route("/all-user-sessions").get(verifyjwt, getAllUserSessions)
router.route("/id/:sessionId").get(verifyjwt, getInterviewSessionById)
router.route("/all-sessions-details").get(verifyjwt, getAllSessionDetails)
router.route("/monthly-sessions-details").get(verifyjwt, getMonthlySessionDetails)
router.route("/monthly-leaderboard").get(verifyjwt, getMonthlyLeaderboard);

export default router;
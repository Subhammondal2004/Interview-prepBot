import express from "express";
import {
    startInterviewSession,
    submitInterviewSession,
    getAllSessionForUser,
    getInterviewSessionById
} from "../controllers/session-controller.js";

const router = express.Router()

router.route("/start-session").post(startInterviewSession)
router.route("/submit").patch(submitInterviewSession)
router.route("/interview-session/:sessionId").get(getInterviewSessionById)

export default router;
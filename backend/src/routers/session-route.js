import express from "express";
import {
    startInterviewSession,
    submitInterviewSession,
    getInterviewSessionById
} from "../controllers/session-controller.js";
import { verifyjwt } from "../middlewares/auth-middleware.js";

const router = express.Router()

router.route("/start-session").post(verifyjwt, startInterviewSession)
router.route("/submit").post(verifyjwt, submitInterviewSession)
router.route("/interview-session/:sessionId").get(verifyjwt, getInterviewSessionById)

export default router;
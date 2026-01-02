import express from "express";
import {
    questionSet,
    getQuestions
} from "../controllers/question-controller.js";
import { verifyjwt } from "../middlewares/auth-middleware.js";

const router = express.Router()

router.route("/question-set/:domain/:difficulty").get(verifyjwt, questionSet)
router.route("/question/:domain").get(getQuestions)

export default router;
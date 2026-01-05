import express from "express";
import {
    questionSet,
    getQuestions,
    getQuestionsOfUser,
    createQuestion,
    deleteQuestion,
    editQuestion
} from "../controllers/question-controller.js";
import { verifyjwt } from "../middlewares/auth-middleware.js";

const router = express.Router()

router.route("/question-set/:domain/:difficulty").get(verifyjwt, questionSet)
router.route("/question/:domain").get(getQuestions)
router.route("/user-question").get(verifyjwt, getQuestionsOfUser)
router.route("/create-question").post(verifyjwt, createQuestion)
router.route("/delete-question/:id").delete(verifyjwt, deleteQuestion)
router.route("/edit-question/:id").patch(verifyjwt, editQuestion)

export default router;
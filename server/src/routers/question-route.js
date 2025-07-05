import express from "express";
import {
    questionSet
} from "../controllers/question-controller.js";


const router = express.Router()

router.route("/question-set/:domain/:difficulty").get(questionSet)

export default router;
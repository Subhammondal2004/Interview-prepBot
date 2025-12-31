import express from "express";
import {
    questionSet
} from "../controllers/question-controller.js";
import { verifyjwt } from "../middlewares/auth-middleware.js";

const router = express.Router()

router.route("/question-set/:domain/:difficulty").get(verifyjwt, questionSet)

export default router;
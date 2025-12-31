import express from "express";
import { verifyjwt } from "../middlewares/auth-middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/auth-controller.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyjwt, logoutUser)
router.route("/refrsh-token").post(verifyjwt, refreshAccessToken)

export default router;
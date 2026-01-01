import express from "express";
import { verifyjwt } from "../middlewares/auth-middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    loggedInUser,
    forgotPassword,
    updateProfile
} from "../controllers/auth-controller.js"

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyjwt, logoutUser)
router.route("/refresh-token").get(verifyjwt, refreshAccessToken)
router.route("/logged-in-user").get(verifyjwt, loggedInUser);
router.route("/forgot-password").patch(forgotPassword);
router.route("/update-profile").patch(verifyjwt, updateProfile);

export default router;
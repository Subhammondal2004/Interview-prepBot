import { asyncHandler } from "../utils/asyncHandler.js";
import  apiError from "../utils/apiError.js";
import { User } from "../models/user-model.js";
import jwt from "jsonwebtoken";

const verifyjwt = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")

        if (!token) {
            throw new apiError(401, "Unauthorized request!!")
        }

        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (!decodedInfo) {
            throw new apiError(400, "Invaild Tokens or expired Tokens!!")
        }
        const user = await User.findById(decodedInfo?._id).select("-refreshToken -password")

        if (!user) {
            throw new apiError(400, "user not found!!")
        }
        req.user = user;
        next()
    } catch (error) {
        throw new apiError(501, error?.message || "Invalid access token")
    }
})

export {
    verifyjwt
}
import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import { User } from "../models/user-model.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new apiError(500, "Internal error while generating tokens!")
    }
}


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fileds are required!!")
    }

    if (!email.includes("@")) {
        throw new apiError(400, "Please provide a valid email address!!");
    }

    if (password.length < 8 && password.includes("")) {
        throw new apiError(400, "Password must be atleast 8 characters and should not contain spaces!!")
    }

    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExists) {
        throw new apiError(400, "User already exists, please try to login!!")
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-refreshToken -password")

    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                createdUser,
                "User registered successfully!!!"
            )
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if ([username, password].some((field) => field?.trim === "")) {
        throw new apiError(400, "All fields are required!!")
    }

    if (password.length < 8 && password.includes("")) {
        throw new apiError(400, "Password must be atleast 8 characters and should not contain spaces!!")
    }

    const user = await User.findOne({
        username
    })

    if (!user) {
        throw new apiError(400, "User doesnot exists!!")
    }

    const passwordCompare = await user.isPasswordCorrect(password)

    if (!passwordCompare) {
        throw new apiError(401, "Invaild password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedIn = await User.findById(user?._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    loggedIn, accessToken, refreshToken
                },
                "User loggedIn successfully!!!"
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new apiResponse(
                200,
                [],
                "User logged out successfully!!!"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req.cookie?.refreshToken || req.body?.refreshToken;

    if (!incomingToken) {
        throw new apiError(401, "Unauthorized request!!")
    }

    try {
        const decodedInfo = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET)

        if (!decodedInfo) {
            throw new apiError(400, "Invaild tokens!")
        }

        const user = await User.findById(decodedInfo?._id)

        if (!user) {
            throw new apiError(400, "User not found!")
        }

        if (incomingToken !== user?.refreshToken) {
            throw new apiError(400, "Invalid token or expired refresh token!")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {},
                    "Access token refreshed successfully!!!"
                )
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh Token")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
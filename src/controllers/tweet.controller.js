import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publishATweet = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(401, "Error to find user")
    }
    
    const {content} = req.body
    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create(
        {
            owner: user._id,
            content: content
        }
    )

    if(!tweet){
        throw new (401, "Error to create to tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet published successfully"))
})

const updateTweet = asyncHandler(async(req, res) => {
    const {tweetId} = req.params

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401, "Invalid tweet id")
    }

    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(401, "user is not found")
    }


})

export {publishATweet}
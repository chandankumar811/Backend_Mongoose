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

    const {content} = req.body

    if(!content){
        throw new ApiError(400, "Content is required")
    }

    const user = await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(401, "user is not found")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(402, "Tweet is not found")
    }

    if(user._id.toString() !== tweet.owner.toString()){
        throw new (ApiError(400, "You can only update your own comment"))
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content
            }
        },{
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"))

})

const getUserTweet = asyncHandler(async(req, res) => {
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(401, "Invalid user id")
    }

    const tweet = await Tweet.find({owner: userId})
    if(!tweet){
        throw new ApiError(401, "Error to fetch user tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet fetched successfully"))
})

const deleteTweet = asyncHandler(async(req, res) => {
    const {tweetId} = req.params
    const user = await User.findById(req.user?._id)

    if(!isValidObjectId(tweetId)){
        throw new ApiError(401, "Invalid tweet id")
    }

    if(!user){
        throw new ApiError(402, "User is not found")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(402, "Tweet is not found")
    }

    if(user._id.toString() !== tweet.owner.toString()){
        throw new (ApiError(400, "You can only update your own comment"))
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully"))
    
})

export {publishATweet, updateTweet, deleteTweet, getUserTweet}
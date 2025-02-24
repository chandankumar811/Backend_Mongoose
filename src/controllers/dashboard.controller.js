import { Subscription } from "../models/subscription.model";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const getChannelStats = asyncHandler(async(req, res) => {
    const channelId =  req.user?._id

    if(!channelId){
        throw new ApiError(401, "Error to get channel id")
    }

    const noOfSubscriber = await Subscription.countDocuments(channelId)


    return res
    .status(200)
    .json(new ApiResponse(200, noOfSubscriber, "fetch successfull"))
})

export {getChannelStats}
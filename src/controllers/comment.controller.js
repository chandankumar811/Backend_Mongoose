import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const addAComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if(!isValidObjectId(videoId)){
    throw new ApiError(404, "Invalid video id")
  }
  const {content} = req.body
  if(!content){
    throw new ApiError(400, "content is required")
  }

  const commentBy = await User.findById(req.user?._id).populate("_id username")

  if(!commentBy){
    throw new ApiError(400, "user doesn't exist")
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: commentBy.id
  })

  return res
  .status(200)
  .json(new ApiResponse(200, comment, "comment added sucessfully"))
});

export {addAComment}

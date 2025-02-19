import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const addAComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Invalid video id");
  }
  console.log(videoId)
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "content is required");
  }

  const commentBy = await User.findById(req.user?._id).populate("_id username");

  if (!commentBy) {
    throw new ApiError(400, "user doesn't exist");
  }

  const comment = await Comment.create({
    content: content,
    video: videoId,
    owner: commentBy.id,
  });

  console.log(comment.video)

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added sucessfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid comment Id");
  }

    const { content } = req.body;
    if (!content) {
      throw new ApiError(400, "Content is required");
    }
    const comment = await Comment.findById(commentId)

    const user = await User.findById(req.user?._id)

    if(comment.owner.toString() !== user._id.toString()){
      throw new ApiError(400, "You can only update your own comment")
    }

     const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $set: {
          content: content,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedComment,"comment updated sucessfully"));

});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(404, "Invalid comment Id");
  }

  const comment = await Comment.findById(commentId);

  if(!comment){
    throw new ApiError(404, "Comment is not found")
  }  

  const user = await User.findById(req.user?._id)
  if(!comment){
    throw new ApiError(404, "user is not found")
  }  

  if(comment.owner.toString() !== user._id.toString()) {
    throw new ApiError(400, "You only can delete your own comment")
  }

  await Comment.deleteOne(comment);

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted successfully"));
});

const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Invalid video id");
  }

  const videoComment = await Comment.find({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoComment, "video comment fetched sucessfully")
    );
});


export { addAComment, updateComment, deleteComment, getVideoComment};

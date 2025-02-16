import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file is uploaded on cloudinary", response.url)
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got
    return null;
  }
};


const deleteFromCloudnary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    
    if (result.result !== "ok") {
      throw new Error("Failed to delete image from Cloudinary");
    }

    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    throw new Error("Error deleting file from Cloudinary");
  }
}

export { uploadOnCloudinary };

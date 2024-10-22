import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// Configuration of cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const respose = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(
      "File Uploaded Sucessfully on cloudinary. File Src",
      respose.url
    );

    // after upload delete the file from server
    fs.unlinkSync(localFilePath);

    return respose;
  } catch (error) {
    console.error("Error uploading file to cloudinary:", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId);
    console.log(
      "File deleted successfully from cloudinary. Public ID:",
      publicId
    );

    return response;
  } catch (error) {
    console.error("Error deleting file from cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

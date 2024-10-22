import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

import { User } from "../models/users.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // TODO: CHECK OTHER LIBRARY FOR VALIDATIONS
  // validate inputs
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  // check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Missing avatar file ");
  }
  // //  CHECK IF WE NEED COVER PATH OR NOT
  // if (!coverLocalPath) {
  //   throw new ApiError(400, "Missing cover image file ");
  // }

  // const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  // const coverImageUrl = await uploadOnCloudinary(coverLocalPath);

  // if (!avatarUrl || !coverImageUrl) {
  //   throw new ApiError(500, "Failed to upload files to cloudinary");
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Uploading avatar", avatar);
  } catch (error) {
    console.error("Error uploading avatar file to cloudinary:", error);
    throw new ApiError(500, "Failed to upload avatar file to cloudinary");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Uploading avatar", coverImage);
  } catch (error) {
    console.error("Error uploading cover image file to cloudinary:", error);
    throw new ApiError(500, "Failed to upload cover image file to cloudinary");
  }

  try {
    const user = await User.create({
      username: username.toLowerCase(),
      email,
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      password,
    });

    console.log(user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("User registration failed");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted"
    );
  }
});

export { registerUser };

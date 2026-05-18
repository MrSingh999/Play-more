const asyncHandler = require('../utils/asyncHandler');
const apiError = require('../utils/apiError');
const User = require('../models/user.model');
const uploadOnCloudinary = require('../utils/cloudinary');
const apiResponse = require('../utils/apiResponse');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');

const generateAccessTokenAndRefreshToken = async (id) => {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, 'Token generation failed');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, fullname, username } = req.body;

  if (
    [email, password, fullname, username].some(
      (field) => !field || field?.trim() === ''
    )
  ) {
    throw new apiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new apiError(409, 'User already exists');
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, 'Avatar file is required');
  }
  if (!coverImageLocalPath) {
    throw new apiError(400, 'Cover file is required');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, 'Avatar upload failed');
  }

  const user = await User.create({
    email,
    password,
    fullname,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
  });

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new apiError(500, 'User creation failed');
  }
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, 'User created successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!(email || username)) {
    throw new apiError(400, 'Email or username is required');
  }
  const user = await User.findOne({
    $or: [{ email }, { username: username?.toLowerCase() }],
  });

  if (!user) {
    throw new apiError(404, 'User not found ');
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new apiError(404, 'Wrong password ');
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new apiResponse(200, { accessToken }, 'Login successful'));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new apiResponse(200, {}, 'User logged out successfully'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(400, 'Invalid access');
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new apiError(401, 'Invalid refresh token');
    }
    if (user.refreshToken !== incomingRefreshToken)
      throw new apiError(401, 'Refresh token expired or used');

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken },
          'Access Token refreshed successfully'
        )
      );
  } catch (error) {
    throw new apiError(401,new apiError(401, error?.message) || 'Invalid refresh token');
  }
});

module.exports = {
  generateAccessTokenAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
};

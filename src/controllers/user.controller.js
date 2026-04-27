const asyncHandler = require('../utils/asyncHandler');
const apiError = require('../utils/apiError');
const User = require('../models/user.model');
const uploadOnCloudinary = require('../utils/cloudinary');
const apiResponse = require('../utils/apiResponse');

module.exports = registerUser = asyncHandler(async (req, res) => {
  const { email, password, fullname, username } = req.body;

  if (
    [email, password, fullname, username].some((field) => field?.trim() == '')
  ) {
    throw new apiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new apiError(409, 'User already exists');
  }

  const avatarLocalPath = req.files?.Avatar[0]?.path;
  const coverImageLocalPath = req.files?.CoverImage[0]?.path;

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
    return res.status(201).json(apiResponse.success(200, createdUser, 'User created successfully'));

    
});

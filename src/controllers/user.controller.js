import AsyncHandler from '../utils/AsyncHandler.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import uploadOnCloudinary from '../utils/Cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';

const registerUser = AsyncHandler(async (req, res) => {
    // get the user details from frontend
    // validation - not empty
    // check if the user already exists in the database
    // check for images, check for avatar
    // upload to cloudinary, avatar
    // create user object in the database
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body;

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne(
        {
            $or: [ { email }, { username } ]
        }
    )
    if(existedUser) {
        throw new ApiError(409, "User already exists with the provided email or username");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Failed to upload avatar image");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url,
        email,
        username,
        password
    })

    const createdUser = await User.findbyId(user._id).select(
        "-password -refreshToken"
    );

    if(!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )

})

const loginUser = AsyncHandler(async (req, res) => {
    res.status(200).json({
        message: "User logged in successfully"
    })
})

export {
    registerUser,
    loginUser
}
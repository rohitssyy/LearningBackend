
import {asyncHandler} from "../utils/asynHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.model.js" 
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
   
    // user details
    // validation -- not empty 
    //check if user already exist through email and if social media username
    // check files avatar images and cover image
    // upload them cloudinary, check avatar again one check
    // create user object -- create entry in DB
    // remove password and refresh tokens from response field
    // check for user creation
    // return response
    
    const { fullName, email, username, password } = req.body
    console.log("Email" , email)
    
    if (
        [ fullName , email , username , password].some((field)=> field?.trim() === "" )
    ) {
        throw new ApiError(400, "All fields are required")
    }

   const existedUser = await User.findOne({
        $or: [{username} , {email}]
    })

    if (existedUser) {
        throw new ApiError(409 , "User with email or username already existed")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)

    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log(coverImageLocalPath)


    if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400 , "Avatar file is required")
    }
    if (!coverImage) {
        throw new ApiError(400 , "coverImage file is required")
    }


   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"
    )
    
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User Registered Successfuully")
    )

})

export  { registerUser }
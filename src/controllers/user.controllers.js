import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespone.js";
import {User} from "../modles/user.model.js";
import {uploadOnCloudinary} from "../utils/FileUploading.cloudinary.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = jwt.sign({ userId: user.id}, 'chai-aur-code-jwt');
            //  .generateAccessToken()
        const refreshToken = jwt.sign({userId: user.id}, 'chai-aur-backend-jwt' );
            // user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        // we have both access and refresh token here. and refresh token is saved in DB 
        // next step is to give access token to the user

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, error, "Something went Wrong while generating token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // res.status(200).json({
    //     message: "OK"
    // })  

    // get user details from frontend
    // validation - not empty
    // check if user already exists or not: email, username
    // check for images, check for avatar which is required
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token  from response
    // check for user creation
    // return response

    const {username, email, fullname, password} = req.body;
    // console.log(req.body)
    console.log("email", email)
    console.log("password", password)
    console.log("username", username)
    console.log("fullname", fullname)

    // validation for empty or not
    // if(fullname === "")
    //     {
    //         throw new ApiError(400, "fullname is required")
    //     }

    if([username, fullname, email, password].some((field) => 
    field?.trim() === "")
    ){
        throw new ApiError(400, "all field is required")
    }
    
    const existedUser =await User.findOne({
        $or:[{email}, {username}]
    })

    if(existedUser)
        {
            throw new ApiError(410, "User with this email or username already exists")
        }

        const avatarFiles = req.files?.avatar;

        const coverImageFiles = req.files?.coverImage;
        // console.log((req.files))
        // console.table(req.files)
        const avatarLocalPath = avatarFiles && avatarFiles.length > 0 ? avatarFiles[0].path : undefined;
        // const coverImageLocalPath = coverImageFiles && coverImageFiles.length > 0 ? coverImageFiles[0].path : undefined;

        let coverImageLocalPath;
        if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
            {
                coverImageLocalPath = req.files.coverImage[0].path
            }
        
        if (!avatarLocalPath) {
          throw new ApiError(404, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        
        if(!avatar)
            {
                throw new ApiError(402, "Error can not upload file to the cloudinary..")
            }

        const user = await User.create({
            fullname, 
            avatar: avatar.url,
            coverImage: coverImage ? coverImage.url: null,
            email,
            password,
            username: username.toLowerCase()
        })
       const createdUser =  await User.findById(user._id).select(
        "-password -refreshToken"
       )

       if(!createdUser)
        {
            throw new ApiError(500, "Something went wrong while registering user")
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User registered Successfully")
        )

        // return res.status(205).json({createdUser})
})

const loginUser = asyncHandler(async (req, res) => {
    // req.body -- data
    // username or email check with db
    // find the user
    // password check
    // password -- if(yes) -- give access and refresh token to the user
    // given through cookie
    const {username, email, password} = req.body;
    
    if(!email && !username)
        {
            throw new ApiError(404, "email and username are required")
        }
    
    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!user)
        {
            throw new ApiError(404, "User doest not exist")
        }
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid)
        {
            throw new ApiError(400, "Password Incorrect")
        }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
        console.log("access Token: ", accessToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    console.log("logged in user: ", loggedInUser)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,{
                user: loggedInUser, accessToken, refreshToken
            },"User logged in Successfully"
        )
    )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.userr._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(202, {}, "User Logged Out")
    )
})

const newRefreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body

    if(!incomingRefreshToken)
    {
        throw new ApiError(404, "Unauthorized Request")
    }

    try {
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log("Decoded Refresh Token: ", decodedRefreshToken)
    
        const user = await User.findById(decodedRefreshToken?.userId)
        console.log("user: ", user)
    
        if(!user)
        {
            throw new ApiError(408, "Invaild Refresh Token")
        }
    
        if(decodedRefreshToken !== user?.refreshToken)
        {
            throw new ApiError(405, "Use incoming Refresh token error")
        }
    
        const options =
        {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(206)
        .cookie("AccessToken", accessToken, options)
        .cookie("RefreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                201, {accessToken, refreshToken: newRefreshToken}, "Access token refreshed"
            )
            )
    } catch (error) {
        throw new ApiError(407, error?.message || "Cannot process refresh Token: invalid Token")
    }
})
export {registerUser, loginUser, logoutUser, newRefreshAccessToken}
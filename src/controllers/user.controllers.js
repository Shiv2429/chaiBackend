import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../modles/user.model.js";
import {uploadOnCloudinary} from "../utils/FileUploading.cloudinary.js"
import { ApiResponse } from "../utils/ApiRespone.js";

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


export {registerUser}
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../modles/user.model.js";

export const verifyJWTT = asyncHandler(async (req, res, next) =>
{
    try {
        console.log("saawan")
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token)
            {
                throw new ApiError(404, "Unautorized request")
            }
        console.log("Token: ", token)
        const decodedTokenn = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const userr = await User.findById(decodedTokenn?.userId)
        console.log("user: ", userr)
        console.log("decodedTokenn: ", decodedTokenn)
    
        if(!userr)
            {
                throw new ApiError(401, "Invalid Access Token")
            }
    
        req.userr = userr
        next()
    } catch (error) {
        throw new ApiError(403, "Invalid Access Tokennnnn")
    }
})
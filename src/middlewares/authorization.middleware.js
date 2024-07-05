// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../modles/user.model.js";

// export const verifyJWT = asyncHandler(async (req, _, next) => {
//    try {
//      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
//      if(!token)
//          {
//              throw new ApiError(401, "unauthorized request: No token provided")
//          }
         
//          console.log("token: ", token)
//      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
//      const user = await User.findOne(decodedToken);
//     //  .select('-password - refreshToken')
//     console.log("decoded Token: ", decodedToken)
//     console.log("User: ", user)
//      if(!user)
//          {
//              throw new ApiError(409, "Invalid Access Token: User not found")
//          }
 
//      req.user = user;
//      next()
//    } catch (error) {
//     console.log("Error in verifying middleware: ", error)
//     throw new ApiError(401, error?.message || "Invalid access token")
//    }
// })
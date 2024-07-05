import      {Router} from "express"
import { registerUser, loginUser, logoutUser, newRefreshAccessToken } from "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js"
// import { verifyJWT } from "../middlewares/authorization.middleware.js"
import { verifyJWTT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post( upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maCount:1
    }
]),
    registerUser)
// router.route("/register").post(login)

router.route("/login").post(loginUser)

// Secured route
router.route("/logout").post(verifyJWTT, logoutUser)
router.route("/refresh-token").post(newRefreshAccessToken)

export default router
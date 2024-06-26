import      {Router} from "express"
import { registerUser } from "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js"

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
export default router
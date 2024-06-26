import express from  "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN
}))
app.use(express.json({limit: "10kb"}))
// above line is used when user submit form

app.use(express.urlencoded ({extended: true, limit: "10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// router import

import userRouter from "./routes/user.routers.js"

// router declaration
app.use("/api/v1/users", userRouter)

// http:localhost:8800/api/v1/users/register

export{app}
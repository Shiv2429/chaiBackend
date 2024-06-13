// import mongoose from "mongoose";
// import express from "express";
// const app = express()
// import { DB_NAME } from "./constants";
// require ('dotenv').config({path: './env'});


import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({
    path: './env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8800, () => {
        console.log(` Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Error connection failed after promise!!", err )
})

















// to avoid getting any DB error (beacuse of syntax) we append ";" semicolon at the start of below line(i.e connection to the DB) 

/*
( async => {
    try {
          await mongoose.connect(`${process.env.MONOGDB_URL}/${DB_NAME}`)
       app.on("Errorr", (error) => {
        console.log("Express unable to connect with DB", error);
        throw error;
       })

       app.listen(process.env.PORT, () =>{
        console.log(`App is listening on port ${process.env.PORT}`);
       } )
    } catch (error) {
        console.error("Hurray! we got an error.", error)
        throw error
    }
})()

*/
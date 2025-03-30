// require('dotenv').config({ path: './env' })
// import mongoose from "mongoose";
// import { DB_NAME, } from "./constant";

import dotenv from "dotenv"
dotenv.config({
    path: "./env"
})

import express from "express"
import connectDB from "./db/index.js";
const app = express()


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`)
        })
    })
    .catch((err) => {
    console.log("mongo Db connection failed!!!" , err)
})









// ; (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.log("ERRRR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
        
//     } catch (error) { 
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()

// (()=> {})()
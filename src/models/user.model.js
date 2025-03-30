import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userScehma = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
        
    },
    avatar: {
        type: String, //Cloundinary
        required: true,
    },
    coverImage: {
        type: String, //Cloundinary
    },
    watchHistory: [ // this is an array of videos
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ] ,
    password: {
        type: String,
        required: [true, "Passowrd is required"]
    },
    refreshToken: {
        type:String
    }
}, { timestamps: true })

// pre hook is one of the ways to execute something before the data is being sent into the db prehook is a method and it has many events like save validate etc
// never in pre use arrow function cause arrow function doesnt have this and it needs context from the schema
// these kinds of operation might take time so use async and await 
// remember its like middleware function so we have to add next so that it does it normal operations

userScehma.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // this is pre hook so everytime anything happens in that scehma and any thing changes in that it will execute this pre and hence we have to add condition 

    this.password = await bcrypt.hash(this.password, 10) // here 10 is salt/rounds
    next()
})

// custom methods - we can have as much as we want
userScehma.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password , this.password)
}

userScehma.methods.generateAccessToken = function () { 
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullName,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        
    )
}

userScehma.methods.generateRefreshToken = function () {

      jwt.sign(
        {
            _id: this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
        
    )

}


const User = mongoose.model("User", userScehma)

export {User}
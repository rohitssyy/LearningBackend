import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewwares/multer.middleware.js"; 

const router = Router();

router.route("/register/").post(
    upload.fields([{
        name: "avatar", 
        maxCount: 1
    }, {
        name: "coerImage",
        maxCount:1
    }]),
    registerUser)


export default router
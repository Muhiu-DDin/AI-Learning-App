import { body } from "express-validator";
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { login , register , getUser , updateProfile , changePassword } from "../controllers/authController.js";



const authRoutes = express.Router()

const registerValidation = [

    // each body() call returns a middleware function. so there are 3 middlewares that why we used array , otherwise we can also pass each middleware to the routes one by one but using array is cleaner ,
    // body() Is used to validate fields coming from req.body
    
    body('username').trim()
    .isLength({min : 3})
    .withMessage("Username must be atleast 3 characters"),

    body('email').isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email') ,

    body('password').isLength({min : 6})
    .withMessage("Password must be atleast 6 characters")

]

const loginValidation = [
    body('email').isEmail()
    .normalizeEmail().
    withMessage('Please provid a valid email') ,

    body('password').notEmpty().withMessage("Password is required")
]

// Public Routes 
authRoutes.post("/login" , loginValidation ,  login )
authRoutes.post("/register" , registerValidation ,  register)

// protected Routes 
authRoutes.get("/profile" , authMiddleware , getUser)
authRoutes.put("/updateprofile" , authMiddleware , updateProfile)
authRoutes.put("/changepassword" , authMiddleware , changePassword)


export default authRoutes
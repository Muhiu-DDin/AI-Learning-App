import getDashboard from "../controllers/progressController.js"
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"

const progressRoutes = express.Router()

progressRoutes.use(authMiddleware)

progressRoutes.get('/getDashboard' , getDashboard)

export default progressRoutes
import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js"
import { getAllQuizzes , getQuiz , submitQuiz , getQuizResult , deleteQuiz} from '../controllers/quizController.js'

const quizRoutes = express.Router()


quizRoutes.use(authMiddleware)

quizRoutes.get("/getQuizzes/:docId" , getAllQuizzes)
quizRoutes.get("/getQuiz/:id" , getQuiz)
quizRoutes.post("/submitQuiz/:id" , submitQuiz)
quizRoutes.get("getResult/:id" , getQuizResult)
quizRoutes.delete("delete/:id" , deleteQuiz)

export default quizRoutes
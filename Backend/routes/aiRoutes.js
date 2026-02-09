import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { getChatHistory , chat , generateFlashcards , generateQuiz , generateSummary , explainConcept } from "../controllers/aiController.js"


const AIRoutes = express.Router()
AIRoutes.use(authMiddleware)

AIRoutes.post('/generate-flashcards' , generateFlashcards)
AIRoutes.post('/generate-quiz' , generateQuiz)
AIRoutes.post('/generate-summary' , generateSummary)
AIRoutes.post('/chat' , chat)
AIRoutes.post('/explain-concept' , explainConcept)
AIRoutes.get('/chat-history/:docId' , getChatHistory)



export default AIRoutes
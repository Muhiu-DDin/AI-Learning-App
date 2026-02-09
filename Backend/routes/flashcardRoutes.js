import express from "express"
import authMiddleware from "../middleware/authMiddleware.js"
import { getAllFlashcards , getFlashcards , reviewFlashcard , toggleStarFlashcards , deleteFlashcardSet} from "../controllers/flashcardController.js"


const flashcardRoutes = express.Router()

flashcardRoutes.use(authMiddleware)

flashcardRoutes.get("/getFlashcards" , getAllFlashcards)
flashcardRoutes.get("/:docId" , getFlashcards)
flashcardRoutes.post("/:cardId/review" , reviewFlashcard)
flashcardRoutes.put("/:cardId/star" , toggleStarFlashcards)
flashcardRoutes.delete("/:id" , deleteFlashcardSet)

export default flashcardRoutes

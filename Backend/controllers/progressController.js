import quizModel from "../models/quizModel.js";
import docModel from "../models/docModel.js";
import flashcardModel from "../models/flashcardModel.js";


export const getDashboard = async (req , res) => {
    try{
        const totalDoc = await docModel.countDocuments({userId : req.user._id})
        const totalFlashcardSet = await flashcardModel.countDocuments({userId : req.user._id})
        const totalQuiz = await quizModel.countDocuments({userId : req.user._id})
        const  totalCompletedQuiz = await quizModel.countDocuments({userId : req.user._id , completedAt : {$ne : null}})

        // flashcard statistics

        const flashcardSets = await flashcardModel.find({userId : req.user._id})
        let totalFlashcards = 0 
        let reviewedFlashcards = 0 
        let starredFlashcards = 0

        flashcardSets.forEach(set => {
            totalFlashcards += set.cards.length
            reviewedFlashcards += set.cards.filter(card => card.reviewCount > 0).length
            starredFlashcards += set.cards.filter(card => card.isStarred).length
        })

        // get quiz statistics 

        const allCompletedQuizzes = await quizModel.find({userId : req.user._id , completedAt : {$ne : null}})
        const avgScoreOfAllQuiz = allCompletedQuizzes.length > 0 ?
        Math.round(allCompletedQuizzes.reduce((sum , quiz) => sum + quiz.score , 0 ) / allCompletedQuizzes.length) : 0


        // latest activity 
        const recentDocs = await docModel.find({userId : req.user._id })
        .sort({lastaccessed : -1}).limit(5).select('title fileName lastaccessed status')

        const recentQuizzes = await quizModel.find({userId : req.user._id})
        .sort({createdAt : -1}).limit(5).populate("documentId" , "title")
        .select('title score totalQuestions completedAt')

        const studyStreak = Math.floor(Math.random() * 7) + 1; // Mock data


        return res.status(200).json({
            success : true , 
            message : "fetching activities" , 
            data : {
                overview : {
                    totalDoc , 
                    totalFlashcardSet ,
                    totalFlashcards,
                    totalQuiz ,
                    totalCompletedQuiz ,
                    reviewedFlashcards ,
                    starredFlashcards , 
                    avgScoreOfAllQuiz ,
                    studyStreak
                } , 
                recentActivity : {
                    documents : recentDocs ,
                    quizzes : recentQuizzes

                }
            }
        })
 
    }catch(error){
        console.log("error in getDashboard =>" , error.message)
        return res.status(400)
        .json({success : false , message : "error in getDashboard"})
    }
}
import quizModel from "../models/quizModel.js"


const getAllQuizzes = async (req , res) =>{
    try{
        const quizzes = await quizModel.find({
            userId : req.user._id , 
            documentId : req.params.docId
        }).populate("documentId" , "title fileName").sort({createdAt : -1})
        // find() never returns null
        if(quizzes.length === 0) return res.status(400).json({success : false , message : "quizzes not found" , quizzes : []})

        return res.status(200).json({
            success : true , 
            message : "quizzes fetched" , 
            count  : quizzes.length
        })

    }catch(error){
        console.log("error in getAllQuizzes" , error.message)
        return res.status(400).json({
            success : false , 
            message : "error in fatching quizzes" , 
         
        })
    }
}

const getQuiz = async (req , res) =>{
    try{
       const quiz = await quizModel.findOne({
            userId : req.user._id , 
            _id : req.params._id
        }).populate("documentId" , "title fileName")
        
        if(!quiz) return res.status(400).json({success : false , message : "quiz not found"})

        return res.status(200).json({
            success : true , 
            message : "quiz fetched" , 
            quiz
         
        })
    }catch(error){
        console.log("error in getQuiz" , error.message)
        return res.status(400).json({
            success : false , 
            message : "error in fatching quiz" 
        })
    }
}

const submitQuiz = async (req , res) =>{
    try{

        const {answers} = req.body

        if(!Array.isArray(answers)){
            return res.status(400).json({
            success : false , 
            message : "please provide array of answers" 
        })
        }

       const quiz = await quizModel.findOne({
            userId : req.user._id ,
            _id : req.params.id 
        })

        if(!quiz) return res.status(400).json({success : false , message : "quiz not found"})

        if(quiz.completedAt){
            return res.status(400).json({success : false , message : "quiz is already completed"})
        }

        let userAnswers = []
        let correctCount = 0 

        answers.forEach(ans => {
            const {questionIndex , selectedAnswer} = ans
            
            if(questionIndex < quiz.questions.length){
                
              const question =  quiz.questions[questionIndex]
              const isCorrect = question.correctAnswer === selectedAnswer

              if(isCorrect) correctCount++
              
              userAnswers.push({
                questionIndex , 
                selectedAnswer , 
                isCorrect , 
                answerAt : new Date(),
              })
                    
            }
        })

        const score = Math.round((correctCount / quiz.totalQuestions) * 100)

        quiz.score = score
        quiz.completedAt = new Date()
        quiz.userAnswers = userAnswers

        await quiz.save()

        return res.status(200).json({
            success : true , 
            message : "quiz submitted" , 
            quiz
        })



    }catch(error){
        console.log("error in submit quiz" , error.message)
        return res.status(400).json({
            success : false , 
            message : "error in submitting quiz" 
        })
    }
}

const getQuizResult = async (req , res) =>{
    try{
        const quiz = await quizModel.findOne({
            userId : req.user._id ,
            _id : req.params._id
        })

        if(!quiz) return res.status(400).json({success : false , message : "quiz not found"})
        if(!quiz.completedAt) return res.status(400).json({success : false , message : "quiz not completed"})
        
        const detailResult = quiz.questions.map((ques , index )=> {
           let answer = quiz.userAnswers.find(ans => ans.questionIndex === index)
           return {
            questionIndex : index ,
            question : ques.question ,
            options : ques.options ,
            correctAnswer : ques.correctAnswer ,
            answer : answer?.selectedAnswer || null ,
            isCorrect : answer.isCorrect,
            explaination : ques.explaination
           }
        })

           return res.status(200).json({
            success : true , 
            message : "quiz submitted" , 
            data : {
                quiz : {
                id : quiz._id , 
                document : quiz.documentId ,
                title : quiz.title ,
                score : quiz.score ,
                totalQuestions : quiz.totalQuestions ,
                completedAt : quiz.completedAt
                } ,
                result : detailResult
            }
        })

    }catch(error){
        console.log("error in getting result" , error.message)
        return res.status(400).json({
            success : false , 
            message : "error in getting result" 
        })
    }
}


const deleteQuiz = async (req , res) =>{
    try{
     const quiz = await quizModel.findOne({
            userId : req.user._id ,
            _id : req.params._id
        })

    if(!quiz) return res.status(400).json({success : false , message : "quiz not found"})
    
    await quiz.deleteOne()

    return res.status(200).json({
            success : true , 
            message : "quiz deleted successfully"
        })

    }catch(error){
        console.log("error in deleting quiz" , error.message)
        return res.status(400).json({
            success : false , 
            message : "error in deleting quiz" 
        })
    }
}


export {deleteQuiz , getAllQuizzes , getQuiz , submitQuiz , getQuizResult}


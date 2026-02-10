import docModel from "../models/docModel.js"
import { findRelevantChunks } from "../utils/textChunker.js"
import * as geminiService from "../utils/geminiService.js"
import flashcardModel from "../models/flashcardModel.js"
import quizModel from "../models/quizModel.js"
import chatHistoryModel from "../models/chatHistoryModel.js"

const generateFlashcards = async (req , res) => {
    try{
        const {documentId , count=10} = req.body
        if(!documentId) return res.status(400).json({success : false , message : "document id is required"})
        
        const document = await docModel.findOne({
                userId : req.user._id ,
                _id : documentId , 
                status : "ready"
            })

        if(!document) return res.status(400).json({success : false , message : "document not found"})
        
        let allQuestions = []
        for(let chunk of document.chunks){
            if(allQuestions.length >= parseInt(count)) break
            const questions = await geminiService.generateFlashcards(chunk.content , parseInt(count))
            allQuestions.push(...questions)
        }

        allQuestions = allQuestions.slice(0 , count )

       const flashcards = await flashcardModel.create({
            userId : req.user._id , 
            documentId : documentId , 
            cards : allQuestions.map(card => (
                {
                    question : card.question , 
                    answer : card.answer ,
                    difficulty : card.difficulty , 
                    reviewCount : 0 ,
                    isStarred  : false ,
                }
            ))
       })

       return res.status(200).json({success : true , message : "flashcard set created" , flashcards})

    }catch(error){
        console.log("error in generating flashcards" , error.message)
        return res.status(400).json({
            success: false,
            message: "error in generating flashcards"
        })
    }
}


const generateQuiz = async (req , res) => {
    try{
        const {documentId , numQuestions = 5 , title} = req.body
        if(!documentId) return res.status(400).json({success : false , message : "document id is required"})
        const doc = await docModel.findOne({
                userId : req.user._id ,
                _id : documentId , 
                status : "ready"})
        if(!doc)  return res.status(400).json({success : false , message : "document not found"})
        
        let allQuizes = []

        for(let chunk of doc.chunks){
        if(allQuizes.length >= parseInt(numQuestions) )  break
        const generatedQuiz = await geminiService.generateQuiz(chunk.content , parseInt(numQuestions))
        allQuizes.push(...generatedQuiz)
        }

        allQuizes = allQuizes.slice(0 , numQuestions)

        const quiz = await quizModel.create({
            userId : req.user._id , 
            documentId ,
            title ,
            questions : allQuizes.map(quiz => (
                {
                    question : quiz.question ,
                    options : quiz.options , 
                    correctAnswer : quiz.correctAnswer,
                    explaination : quiz.explanation , 
                    difficulty : quiz.difficulty,
                } 
            )) ,
            userAnswers : [] ,
            score : 0 , 
            totalQuestions : allQuizes.length,
        })
        return res.status(200).json({success : true , message : "quiz created successfully" , quiz })

    }catch(error){
        console.log("error in generating quiz" , error.message)
        return res.status(400).json({
            success: false,
            message: "error in generating quiz"
        })
    }
}


const generateSummary = async (req , res) => {
    try{
        const {documentId} = req.body
       if(!documentId) return res.status(400).json({success : false , message : "document id is required"})

        const doc = await docModel.findOne({
            userId : req.user._id , 
            _id : documentId , 
            status : "ready"
        })
        if(!doc)  return res.status(400).json({success : false , message : "document not found"})

        let allSummarizeChunk = []
        for(let chunk of doc.chunks){
           const summary =  await geminiService.generateSummary(chunk.content)
            allSummarizeChunk.push(summary)
        }
        const combineSummary = allSummarizeChunk.join("\n\n")

        const finalSummary = await geminiService.generateSummary(combineSummary)

        return res.status(200).json({
        success: true,
        message: "summary generated successfully",
        summary: finalSummary,
        });

    }catch(error){
        console.log("error in generating summary", error.message);
        return res.status(400).json({
        success: false,
        message: "error in generating summary",
        });   
    }
}


const chat = async (req , res) => {
    try{
        const {documentId , question} = req.body
        if(!documentId || !question) return res.status(400).json({success : false , message : "document or question are required"})
        
            const document = await docModel.findOne({
                userId : req.user._id ,
                _id : documentId , 
                status : "ready"
            })

        if(!document) return res.status(400).json({success : false , message : "document not found"})


       const relevantChunks = await findRelevantChunks(document.chunks , question , 3)
       const chunkIndces = relevantChunks.map(chunk => chunk.chunkIndex)

    //    save the chat history 

       let chatHistory = await chatHistoryModel.findOne({
        userId : req.user._id , 
        documentId
       })

       if(!chatHistory){
           chatHistory = await chatHistoryModel.create({
           userId : req.user._id , 
           documentId  ,
           messages : []
          })
        }

        const answer = await geminiService.chatWithContext(question , relevantChunks)

        chatHistory.messages.push(
        {
            role : 'user' , 
            content : question ,
            relevantChunks : []
        } , 

        {

            role : 'assistant' , 
            content : answer , 
            relevantChunks : chunkIndces
        }  )

        await chatHistory.save()

        return res.status(200).json({
        success: true,
        message: "chat generated successfully",
        data : {
            question ,
            answer , 
            relevantChunks : chunkIndces , 
            chatHistoryId : chatHistory._id
        }
        });



    }catch(error){
        console.log("error in generating chat", error.message);
        return res.status(400).json({
        success: false,
        message: "error in generating chat",
        });   
    }
}

const explainConcept = async (req , res) => {
    try{
       const {documentId , concept} = req.body
       if(!documentId || !concept ) return res.status(400).json({success : false , message : "fields are required"})
        const document = await docModel.findOne({
            userId : req.user._id , 
            _id : documentId ,
            status : "ready"
    })
    if(!document) return res.status(400).json({success : false , message : "document not found"})

    const relevantChunks = await findRelevantChunks(document.chunks , concept , 3)
    const context = relevantChunks.map(chunk => chunk.content).join("\n\n");

    const explaination = await geminiService.explainConcept(concept , context)


    return res.status(200).json({
        success : true , 
        data : {
            concept , 
            explaination , 
            relevantChunks : relevantChunks.map(c => c.chunkIndex)
        },
        message : "explaination generated"
    })


    }catch(error){
        console.log("error in generating explaintion", error.message);
        return res.status(400).json({
        success: false,
        message: "error in generating explaination",
        });   
    }
}


const getChatHistory = async (req , res) => {
    try{
        const {documentId} = req.body
        if(!documentId ) return res.status(400).json({success : false , message : "fields are required"})
        const history = await chatHistoryModel.findOne({
        userId : req.user._id , 
        documentId ,
        }).select("messages")
       
        if(!history){
          return res.status(400).json({
            success: false,
            message: "histroy not found",
            });
        }

        return res.status(200).json({
        success: true,
        message: "history fetched",
        history
        });

        }catch(error){
            console.log("error in fetching history", error.message);
            return res.status(400).json({
            success: false,
            message: "error in fetching history",
        });   
    }
}




export {explainConcept , chat , generateFlashcards , generateQuiz , generateSummary , getChatHistory }
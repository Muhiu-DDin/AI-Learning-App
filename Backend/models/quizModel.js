import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "userModel" ,
        required : true
    } , 
    documentId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "docModel" ,
        required : true 
    },
    title : {
        type : String , 
        required : true,
        trim : true
    },

    // for just array use [] like in questions , but for array + validation use {} like options 

    questions : [
        {
            question : {
                type : String , 
                required : true 
            },
            
            options : {
                type : [String] ,
                validate : [(arr)=> arr.length === 4 , "Must have exactly 4 options" ]
            } , 

            correctAnswer : {
            type : String , 
            required : true
            } ,

            explaination : {
                type : String , 
                default : ''
            },

            difficulty : {
                type : String ,
                enum : ["easy" , "medium" , "hard"],
                default : "medium"
            } ,
        }
    ] , 
    userAnswers : [
       {
        questionIndex : {
            type : Number, 
            required : true
        } , 
        selectedAnswer : {
            type : String , 
            required : true
        } , 
        isCorrect : {
            type : Boolean , 
            required : true
        } , 
        // dont call Date.now() as all the documents will have the same timestamp 
        answeredAt : {
            type : Date ,
            default : Date.now
        }

       }
    ]  ,
    score : {
        type : Number , 
        default : 0
    },
    totalQuestions : {
        type : Number ,
        required : true 
    },
    completedAt : {
        type : Date ,
        default : null
    }

} , {timestamps : true})

// index for faster query , here 1 is sort ascending order 
// MongoDB will now quickly find quizzes for a specific user and document without scanning all documents.
// MongoDB sorts the index first by userId, then within each userId by documentId
// example : await quizModel.find({ userId: "u101", documentId: "d201" })
// MongoDB goes to index: find u101 → within u101 find d201


quizSchema.index({userId : 1 , documentId : 1})

const quizModel = mongoose.models?.quizModel || mongoose.model("quizModel" , quizSchema)
export default quizModel
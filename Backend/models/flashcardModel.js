import mongoose from "mongoose" 

const flashcardSchema = new mongoose.Schema({
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
    cards : [
        // mongodb also assign ids (cards._id) to each subdocument present is cards 
        {
            question : {
                type : String ,
                required : true 
             } ,
            answer : {
                type : String , 
                required : true
             },
            difficulty : {
                    type : String ,
                    enum : ["easy" , "medium" , "hard"],
                    default : "medium"
            } ,
            lastReviewed : {
                type : Date , 
                default : null 
            },
            reviewCount : {
                type : Number ,
                default : 0
            } , 
            isStarred : {
                type : Boolean ,
                default : false
            }
        }
    ]
} , {timestamps : true})

// This creates a sorted lookup table like this (simplified):
// (userId, documentId) → document locations
// --------------------------------------
// (U1, D1) → [flashcard1, flashcard2 , flashcard3]
// (U1, D2) → [flashcard4]

// so mongodb Goes directly to the index and Finds (userId, documentId)

flashcardSchema.index({userId : 1 , documentId : 1})

const flashcardModel = mongoose.models?.flashcardModel || mongoose.model("flashcardModel" , flashcardSchema)
export default flashcardModel
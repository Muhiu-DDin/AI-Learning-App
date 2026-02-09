import mongoose from "mongoose" 

const chatHistorySchema = new mongoose.Schema({
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
     messages : [
        {
            role : {
                type : String , 
                enum : ['user' , 'assistant'],
                required : true
            } , 
            content : {
                type : String , 
                required : true
            },
            timestamp : {
                type : Date , 
                default : Date.now
            } ,
            relevantChunks : {
                type : [Number] ,
                default : []
            }
        }
     ] 

} , {timestamps : true})

chatHistorySchema.index({userId : 1 , documentId : 1})


const chatHistoryModel = mongoose.models?.chatHistoryModel || mongoose.model("chatHistoryModel" , chatHistorySchema)
export default chatHistoryModel
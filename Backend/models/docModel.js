import mongoose from "mongoose" 

const docSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "userModel" ,
        required : true
    } , 
    title : {
        type : String , 
        required  : [true , "Title is required"]
    },
    fileName : {
        type : String , 
        required  : true
    },
    // local path 
    filePath : {
        type : String , 
        required  : true
    },
    fileSize : {
        type : Number , 
        required  : true
    },
    extractedText : {
        type : String , 
        default : ""
    },
    chunks : [
        {
            content : {
                type : String , 
                required : true
            } , 
            pageNumber : {
                type : Number , 
                default : 0
            },
            chunkIndex : {
                type : Number , 
                required : true
            } 
        }
    ] , 

    uploadDate : {
        type : Date , 
        default : Date.now
    },
    lastaccessed : {
        type : Date ,
        default : Date.now
    },
    status : {
        type : String , 
        enum : ["processing" , "ready" , "failed"],
        default : "processing"
    }


    
} , {timestamps : true})

docSchema.index({userId : 1 , uploadDate : -1})

const docModel = mongoose.models?.docModel || mongoose.model("docModel" , docSchema)
export default docModel
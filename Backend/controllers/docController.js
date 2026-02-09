import docModel from "../models/docModel.js";
import  flashcardModel from "../models/flashcardModel.js"
import  quizModel from "../models/quizModel.js"
import fs from "fs/promises";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";
import mongoose from "mongoose"

const uploadDocument = async(req , res)=>{
    try{
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const {title} = req.body
        if(!title){
            fs.unlink(req.file.path)
             return res.status(400).json({ success: false, message: "title not provided" });
        }

        // constructing public url for uploaded file 
        const baseURL = process.env.BASEURL
        const fileURL = `${baseURL}/uploads/documents/${req.file.filename}`
        const localPath = req.file.path

        const document = await docModel.create({
            userId : req.user._id , 
            title ,
            fileName : req.file.originalname , 
            filePath : fileURL , 
            localPath ,
            fileSize : req.file.size , 
            status : "processing"
        })

        // process pdf in background (in prodcution use a queue like bull )

        processPDF(document._id , req.file.path).catch(err=> console.error(err))

        return res.status(200).json({success : true , message : "document uploaded!" , document})


    }catch(error){
        await fs.unlink(req.file.path).catch(()=>{})
        console.log("error in uploading doc" , error.message)
        return res.status(400).json({
            success: false,
            message: "uploading doc error"
        })
}
}

// helper function 

const processPDF = async(id , filePath)=>{
        try{
          const {text} =  await extractTextFromPDF(filePath)
          const chunks = chunkText(text , 500 , 50)

          await docModel.findByIdAndUpdate(id , 
            {
                extractedText : text,
                chunks ,
                status : "ready"
            }
          )

          console.log("document processed successfully")
        }catch(error){
            console.log("error in proccessing" , error)
            
          await docModel.findByIdAndUpdate(id , 
            {
                status : "failed"
            }
          )
        }
}

const  getDocuments = async(req , res)=>{
    try{
      const documents = await docModel.aggregate([
        {
            // filters the docs from the current collection (docModel) and passess to the next stage  then go to from 
            $match : { userId : new mongoose.Types.ObjectId(req.user._id) }
        } , 
        {
            $lookup : {
                from : "flashcardModel" , 
                localField : "_id" ,
                foreignField :  "documentId" ,
                as : "flashcards"
            } 
        } ,
        {
            $lookup : {
                from : "quizModel" , 
                localField :"_id" , 
                foreignField :  "documentId" ,
                as : "quizzes"
            }
        },{
            $addFields : {
                flashcardCount : {$size : "$flashcards"},
                quizCount : {$size : "$quizzes"}
            }
        },{
            $project : {
                extractedText : 0 ,
                chunks : 0 , 
                flashcards : 0 , 
                quizzes : 0
            }
        } , {
            $sort : {uploadDate : -1}
        }
       ])

         return res.status(200).json({
            success: true,
            message: "documents fetched!",
            documents , 
            count : documents.length
        })


    }catch(error){
        console.log("error in getDocuments" , error.message)
         return res.status(400).json({
            success: false,
            message: "error in fetching docs"
        })
    }
}

const getDoc = async(req , res)=>{
    try{
        const {id} = req.params

       const doc = await docModel.findOne({
            _id : id , 
            userId : req.user._id
        })

        if(!doc) return res.status(400).json({success : false , message : "doc not found"})
        
        const flashcardCounts = await flashcardModel.countDocuments({userId : req.user._id , documentId : doc._id})
        const quizCounts = await quizModel.countDocuments({userId : req.user._id , documentId : doc._id})

        doc.lastaccessed = Date.now()
        await doc.save() 

        const docData = doc.toObject()
        docData.flashcardCount = flashcardCounts
        docData.quizCount = quizCounts

        return res.status(200).json({
            success: true,
            message: "doc fetched!",
            docData
        })

    }catch(error){
        console.log("error in getDoc" , error.message)
         return res.status(400).json({
            success: false,
            message: "error in fetching doc"
        })
    }}

const deleteDoc = async(req , res)=>{
    try{
        const {id} = req.params

        const doc = await docModel.findOne({
            _id : id , 
            userId : req.user._id
        })

        if (!doc){
        return res.status(404).json({
            success: false,
            message: "Document not found",
        });
        }

        fs.unlink(doc.localPath).catch(()=>{})

        await doc.deleteOne()

        res.status(200).json({
        success: true,
        message: "Document deleted successfully",
        });

    }catch(error){
        console.log("error in deleteDoc" , error.message)
        return res.status(400).json({
            success: false,
            message: "error in deleting doc"
        })
    }
}


export {uploadDocument , getDocuments , getDoc , deleteDoc}
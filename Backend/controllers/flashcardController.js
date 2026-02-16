import flashcardModel from "../models/flashcardModel.js"


// get all flashcards for a user
const getAllFlashcards = async (req , res) => {
    try{
        const userFlashcards = await flashcardModel.find({userId : req.user._id}).
        populate("documentId" , "title")

        if(!userFlashcards) return res.status(400).json({success : false , message : "no flashcard found"})

        return res.status(200).json({success : true , message : "flashcard fetched!" , userFlashcards})

    }catch(error){
        console.log("error in getAllFashcards =>" , error.message)
        return res.status(400)
        .json({success : false , message : "error in fetching flashcards"})
    }
}

// get all flashcards of a document
const getFlashcards = async (req , res) => {
    try{
       const flashcards = await flashcardModel.find({userId : req.user._id , documentId : req. params.docId})
       .populate("documentId" , "fileName title").sort({createdAt : -1})

       if(!flashcards) return res.status(400).json({success : false , message : "no flashcard found"})

      return res.status(200)
      .json({success : true , message : "fetched all flashcards" , flashcards})

    }catch(error){
        console.log("error in getAllFashcards =>" , error.message)
        return res.status(400)
        .json({success : false , message : "error in fetching flashcards"})
    }

}


const reviewFlashcard = async (req , res) => {
    try{
        const flashcardSet = await flashcardModel.findOne({
            'cards._id' : req.params.cardId , 
            userId : req.user._id
        }) 

        
        if(!flashcardSet) return res.status(400).json({success : false , message : "no set found"})
        
        const index = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)
        if(index === -1)  return res.status(400).json({success : false , message : "card not found in the set"})
        
        flashcardSet.cards[index].lastReviewed = new Date()
        flashcardSet.cards[index].reviewCount += 1

        await flashcardSet.save()

         return res.status(200).json({success : true , message : "flashcard reviewed successfully"})
        
    }catch(error){
        console.log("error in reviewing =>" , error.message)
        return res.status(400)
        .json({success : false , message : "error in reviewing"})

    } 
}



const toggleStarFlashcards = async (req , res) => {
    try{
        const flashcardSet = await flashcardModel.findOne({
            'cards._id' : req.params.cardId ,
             userId : req.user._id
        })
        if(!flashcardSet) return res.status(400).json({success : false , message : "no set found"})

       const index = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)
       if(index === -1) return res.status(400).json({success : false , message : "card not found in the set"})

        flashcardSet.cards[index].isStarred = !flashcardSet.cards[index].isStarred

        await flashcardSet.save()
        return res.status(200).json({success : true , message : "flashcard toggled successfully"})

    }catch(error){
        console.log("error in toggeling =>" , error.message)
        return res.status(400)
        .json({success : false , message : "error in toggeling"})
    }
}


const deleteFlashcardSet = async (req , res) => {
    try{
        const set = await flashcardModel.findOne({
            _id : req.params.id , 
            userId : req.user._id
        })
        if(!set) return res.status(400).json({success : false , message : "no set found"})

       await set.deleteOne()
       return res.status(200).json({success : true , message : "flashcard deleted successfully"})

    }catch(error){
         console.log("error in deleting set =>" , error.message)
        return res.status(400)
        .json({success : false , message : "error in deleting set"})
    }
}

export {getAllFlashcards , getFlashcards , reviewFlashcard , toggleStarFlashcards , deleteFlashcardSet}
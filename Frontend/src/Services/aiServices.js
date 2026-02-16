
const generateUserFlashcards = async (docId , options) =>{
     try{
        const res = await axiosInstance.post("ai/generate-flashcards" , {documentId : docId , ...options } )
        if(res.data.success){
        return res.data.flashcards
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const generateUserQuiz = async (docId , options) => {
  try{
        const res = await axiosInstance.post("ai/generate-quiz" , {documentId : docId , ...options } )
        if(res.data.success){
        return res.data.quiz
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const generateUserSummary = async (docId ) => {
   try{
        const res = await axiosInstance.post("ai/generate-summary" , {documentId : docId  } )
        if(res.data.success){
        return res.data.summary
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const generateUserChat = async (docId , question) => {
  try{
        const res = await axiosInstance.post("ai/chat" , {documentId : docId , question } )
        if(res.data.success){
        return res.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}
const generateUserConcepts = async (docId , concept) => {
    try{
        const res = await axiosInstance.post("ai/explain-concept" , {documentId : docId , concept } )
        if(res.data.success){
        return res.data
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const fetchedUserChatHistory = async (docId) => {
    try{
       const res = await axiosInstance.get(`ai/chat-history/${docId}` )
        if(res.data.success){
        return res.data.history
       }
    }catch(error){
        throw new Error(error.response.data.message);
    }
}

const aiServices = {fetchedUserChatHistory , generateUserChat , generateUserConcepts , generateUserSummary , generateUserQuiz , generateUserFlashcards}

export default aiServices
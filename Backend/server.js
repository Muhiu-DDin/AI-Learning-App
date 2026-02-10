import dotenv from "dotenv";
dotenv.config();

import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
import ConnectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import docRoutes from "./routes/docRoutes.js";
import AIRoutes from "./routes/aiRoutes.js";
import flashcardRoutes from "./routes/flashcardRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoute.js"


// ES6 modules dirname alternatives

// fileURLToPath convert a file URL into a normal file system path ,
// import.meta.url always points to the current module/file.
const __filename = fileURLToPath(import.meta.url)
// folder path that contains this file
const __dirname = path.dirname(__filename)



const app  = express()

// middleware 
app.use(cors({
    origin : "*" ,
    methods : ["GET" , "POST" , "PUT" , "DELETE"],
    allowedHeaders : ["Content-Type" , "Authorization"],
    credentials : true
}))


// parse incoming JSON data in the request body
app.use(express.json())
// This parses data sent from HTML forms
app.use(express.urlencoded({extended : true}))


// “Whenever a request starts with /uploads, look inside the uploads folder on disk and serve files from there.”

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use("/api/auth" , authRoutes)
app.use("/api/documents" , docRoutes)
app.use("/api/flashcards" , flashcardRoutes)
app.use("/api/ai" , AIRoutes)
app.use("/api/quiz", quizRoutes)
app.use("/api/getProgress" , progressRoutes)

// 404 error handler
app.use((req , res)=>{
     return  res.status(404).json({
        success :false , 
        error : "Route not found",
        statusCode : 404
    })
})

// error handling 


const PORT = process.env.PORT || 8000

const startServer = async () => {
  try {
    await ConnectDB()         

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Server failed to start:", error)
    process.exit(1)
  }
}


// process is global Node.js object representing the running process
// unhandledRejection is an event triggered when a Promise is rejected but no .catch() or try/catch handles it


process.on('unhandledRejection' , (err)=>{
    console.log("error =>" , err.message)
    process.exit(1)
})


startServer()

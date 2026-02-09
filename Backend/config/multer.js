import {fileURLToPath} from "url"
import path from 'path'
import fs from 'fs'
import multer from "multer"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname , "../uploads/documents")

if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir , {recursive : true}) 

// configuration 

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , uploadDir)
    } , 
    filename : (req , file , cb) => {
        const unique = Date.now()+"-"+Math.round(Math.random()*1E9)
        cb(null , unique + "-" + file.originalname )
    } 
})

  // allow only pdf  

    const fileFilter = (req , file , cb) => {
        if(file.mimetype === "application/pdf") cb(null , true)
        else cb(new Error('Only  PDF files are allowed') , false)
    }


const upload = multer({
    storage ,
    fileFilter , 
    limits : {
        // 10485760   = 10 MB
        fileSize : parseInt(process.env.MAX_FILE_SIZE ) || 10485760
    }
})

export default upload
import express from "express"
import upload from "../config/multer.js"
import { uploadDocument , getDocuments , getDoc , deleteDoc} from "../controllers/docController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const docRoutes = express.Router()

docRoutes.use(authMiddleware)

docRoutes.post("/upload" , upload.single("file") , uploadDocument)
docRoutes.get("/getDocs" , getDocuments)
docRoutes.get("/:id" , getDoc)
docRoutes.delete("/:id" , deleteDoc)


export default docRoutes


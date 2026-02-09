import fs from "fs/promises"
import {PDFParse} from "pdf-parse"

export const extractTextFromPDF = async(filePath)=>{
    try{    
    // Reads a file as raw bytes (or a string if you specify encoding).
    // Returns a Buffer (binary data) by default.
    // The data here is not text, it’s the PDF file content in bytes. You can’t just .toString() and expect readable text, because PDFs are binary and structured internally

    const buffer = await fs.readFile(filePath)
    // PDFParse takes Uint8Array (type of an array used to represent raw binary data)
    // converts PDF bytes into a string of text, plus metadata (number of pages, author, etc)

    const parse = new PDFParse(new Uint8Array(buffer))
    const textData = await parse.getText();

    return {
        text : textData.text ,
        numPages : textData.numPages ,
        info : textData.info
    }
    }catch(error){
        console.log("error in extractTextFromPDF" , error)
        throw new Error("Failed to extract text from pdf")
    }
}
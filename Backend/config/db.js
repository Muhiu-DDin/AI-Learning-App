import mongoose from "mongoose";

const ConnectDB = async()=>{

    let cache = global.mongoose ; 

    if(!cache){
        cache = global.mongoose = {conn : null , promise : null}
    }
    const url = process.env.MONGODB_URI
    if(!url) throw new Error("url in dot define")

     // Call after connection is established
    if(cache.conn){
        console.log("Using cached , MongoDB is Connected");
        return Cache.conn
    }

    if(!cache.promise){
        console.log("Connecting to MongoDB...");
        cache.promise = mongoose.connect(url).then((res)=> {
            console.log("MongoDB connection established");
            return mongoose.connection
        })
    }
    // promise exist 
    // when there is Second call while first connection is in progress
    try{
    cache.conn =   await cache.promise
    }catch(error){
            console.error("Error connecting to MongoDB:", error.message);
            cache.promise = null;
            throw new Error("Error in connecting DB");
    }
}

export default ConnectDB
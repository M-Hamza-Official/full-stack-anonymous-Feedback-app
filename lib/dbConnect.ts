import mongoose, { connection } from "mongoose";

type connectionObject={
    isConnected?:number
}

const Connection:connectionObject ={
}
//assignment: check for db logs
async function dbconnect():Promise<void>{
    if(Connection.isConnected){
    console.log("database is already connected");
    return;
    }
    try {
        if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
}

await mongoose.connect(process.env.MONGODB_URI);
     const db=   await mongoose.connect(process.env.MONGODB_URI || "")
     Connection.isConnected = db.connections[0].readyState
     console.log("db connected successfully");
     

    } catch (error) {
        console.log(error);
        
        process.exit()
    }
    
}
export default dbconnect
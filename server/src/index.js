import dotenv from "dotenv"
import app  from "./app.js"
import { connectionDB } from "./db/db-connection.js"

dotenv.config({
    path: "./env"
})

connectionDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running on PORT: ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed!!", error)
})
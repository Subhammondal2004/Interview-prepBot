import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

const options={
    origin: process.env.CORS_ORIGIN,
    Credential: true
}

app.use(cors({
    options
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(cookieParser())


export default app;
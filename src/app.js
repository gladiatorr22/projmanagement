import express from "express"
import cors from "cors"

const app = express()

// middleware & basic configuration 
app.use(express.json({limit:"16kb"})) 
app.use(express.urlencoded({extended: true , limit:"16kb"}))
app.use(express.static("public"))

// cors configuration 
app.use(cors({
    origin: process.env.CROSS_ORIGIN?.split(",") || "http://localhost:51733" , 
    credentials:true , 
    methods: ["GET" , "POST" , "PUT" , "PATCH" , "DELETE" , "OPTIONS"],
    allowedHeaders : ["Authorization" , "Content-Type"]
}))

// router
import healthCheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRouter);

app.get("/",(req,res)=>{
    res.end("welcome to proj-management")
})

export default app;
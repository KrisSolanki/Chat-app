// const express = require("express")
import express from "express";
import authRouter from "./src/routes/auth.js"
import dotenv from "dotenv";
import { db } from "./src/utils/db.js";
import cookieParser from "cookie-parser";
const app = express()
dotenv.config()
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter)
const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})
db();
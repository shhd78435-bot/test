import express from "express"
import bootsrap from "./src/bootstrap.js"
//import "dotenv/config"
const app=express()
bootsrap(app,express)
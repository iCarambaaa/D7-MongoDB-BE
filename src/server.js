import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import mongoose from "mongoose"
import blogsRouter from "./services/blogs/index.js";
import authorsRouter from "./services/authors/index.js"
import { notFoundHandler, badRequestHandler, genericErrorHandler, unauthorizedHandler } from "./errorHandlers.js"
import meRouter from './services/me/index.js';
const server = express();

const port = process.env.PORT || 3001

// ********************************* MIDDLEWARES ***************************************

server.use(cors())
server.use(express.json())

// ********************************* ROUTES ********************************************

server.use("/blogs", blogsRouter)
server.use("/authors", authorsRouter)
server.use("/me", meRouter)

// ********************************* ERROR HANDLERS ************************************

server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(badRequestHandler)
server.use(genericErrorHandler)


mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Mongo Connected!")


server.listen(port, () => {
    
  console.table(listEndpoints(server))
    console.log(`✅ Server running on port ${port}`)
})
})

mongoose.connection.on("error", err => {
  console.log(err)
})
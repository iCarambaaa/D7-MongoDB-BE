import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import mongoose from "mongoose"
//import { notFoundHandler, badRequestHandler, genericErrorHandler } from "./errorHandlers.js"
const server = express();

const port = process.env.PORT || 3001

// ********************************* MIDDLEWARES ***************************************

server.use(cors())
server.use(express.json())

// ********************************* ROUTES ********************************************



// ********************************* ERROR HANDLERS ************************************

// server.use(notFoundHandler)
// server.use(badRequestHandler)
// server.use(genericErrorHandler)


mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
    console.log("Mongo Connected!")
    
    console.log("hello")

server.listen(port, () => {
    console.table(listEndpoints(server))

    console.log(`Server running on port ${port}`)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})
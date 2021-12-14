import express from 'express';
import BlogModel from '../blogs/schema.js'
// import createHttpError from 'http-errors';
import { basicAuthMiddleware } from "../../auth/basic.js"


const meRouter = new express.Router()

meRouter.get("/stories", basicAuthMiddleware, async (req, res, next) => {
    try {
        const posts = await BlogModel.find({author: req.author._id})
        console.log(posts) // inside .find() we can provide filters as argument
        res.status(200).send(posts)
    } catch (error) {
        next(error)
    }
})



export default meRouter
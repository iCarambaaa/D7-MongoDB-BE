import express from 'express';
import BlogModel from "./schema.js"
import createHttpError from 'http-errors';

const blogsRouter = express.Router()

blogsRouter.post("/", async (req, res, next) => {
    try {
        const newPost = new BlogModel(req.body) // here is validation phase of req.body

        const {_id} = await newPost.save() // here we save to DB also destructuring newPost to send only _id back to FE 
        res.status(201).send({_id})

    } catch (error) {
        next(error)
    }
}) 

blogsRouter.get("/", async (req, res, next) => {
    try {
        const posts = await BlogModel.find() // inside .find() we can provide filters as argument
        res.status(200).send(posts)
    } catch (error) {
        next(error)
    }
})

blogsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id

        const post = await BlogModel.findById(id)
        if(post) {
            res.status(200).send(post)
        } else {
            next(createHttpError(404, `Blogpost with id ${id} not found`))
        }
    } catch (error) {
        next(error)
    }
})

blogsRouter.put("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const updatedPost =  await BlogModel.findByIdAndUpdate(id, req.body, {new: true }) // {new:true} to see the updated post in res
       if(updatedPost){
           res.status(200).send(updatedPost)
       } else {
        next(createHttpError(404, `Blogpost with id ${id} not found`))
       }

    } catch (error) {
        next(error) 
    }
})

blogsRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const postToDelete = await BlogModel.findByIdAndDelete(id)
        if(postToDelete){
        res.send(`Blog post with ${id} deleted successfully`)}
        else {
            next(createHttpError(404, `Not able to delete, blogpost with id ${id} not found.`))
        }
    } catch (error) {
        next(error)
    }
})

export default blogsRouter
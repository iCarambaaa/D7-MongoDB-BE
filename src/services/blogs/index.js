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
            next(createHttpError(404, `Blogpost with id ${id} not found`)) // not working 
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

// GET /blogPosts/:id/comments => returns all the comments for the specified blog post

blogsRouter.get("/:id/comments", async (req, res, next) => {
    try {
        const id = req.params.id
        const post = await BlogModel.findById(id)
        // as oneliner: const post = await BlogModel.findById(req.params.id)

        if(post) {
            res.status(200).send(post.comments)
        } else {
            next(createHttpError(404, `Blogpost with id ${id} not found`))
        }
    } catch (error) {
        next(error)
    }
})


// GET /blogPosts/:id/comments/:commentId=> returns a single comment for the specified blog post

blogsRouter.get("/:id/comments/:commentId", async(req, res, next) => {
    try {
        const post = await BlogModel.findById(req.params.id)
        if(post) {
        const comment = post.comments.find(comment => comment._id.toString() === req.params.commentId)
            if(comment) {
                res.status(200).send(comment)
            } else {
                next(createHttpError(404, `Comment with id ${req.params.commentId} not found`))
        }
    } else {
        next(createHttpError(404, `Blogpost with id ${req.params.id} not found`))
    } }
    catch (error) {
        next(error)
    }
}) 


// POST /blogPosts/:id/comments => adds a new comment for the specified blog post

blogsRouter.post("/:id/comments", async (req, res, next) => {
    try {
        const newComment = await BlogModel.findByIdAndUpdate(req.params.id, {$push: {comments: req.body}}, {new: true})
        console.log("here", newComment) // ask here error handling not working
        if (newComment) {
            res.send(newComment.comments)
        } else {
            next(createHttpError(404, `Blogpost with id ${id} not found`))
        }
    } catch (error) {
        next(error)
    }
})

// PUT /blogPosts/:id/comment/:commentId => edit the comment belonging to the specified blog post

blogsRouter.put("/:id/comments/:commentId", async (req, res, next) => {
    try {
        const post = await BlogModel.findById(req.params.id)
            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment._id.toString() === req.params.commentId)
                    if (commentIndex !== -1) {
                        post.comments[commentIndex] = {...post.comments[commentIndex].toObject(), ...req.body}
                        await post.save()
                        res.status(200).send("updated succesfully" + post.comments[commentIndex])
                    } else {
                        next(createHttpError(404, `Comment with id ${req.params.commentId} not found`))
                    }
                 } else {
                next(createHttpError(404, `Blogpost with id ${req.params.id} not found`))
            }
            
    } catch (error) {
        next(error)
    }
})



// DELETE /blogPosts/:id/comment/:commentId=> delete the comment belonging to the specified blog post


blogsRouter.delete("/:id/comments/:commentId", async (req, res, next) => {
    try {
        const commentToDelete = await BlogModel.findByIdAndUpdate(
            req.params.id,
            {$pull: {comments: {_id: req.params.commentId}}},
            {new: true} // pull removes item from array
        )
        if (commentToDelete) {
            res.send(commentToDelete)
        } else {
            next(createHttpError(404, `Blogpost with id ${req.params.id} not found`))
        }
    } catch (error) {
        next(error)
    }
})

export default blogsRouter
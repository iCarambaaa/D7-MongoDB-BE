import express from 'express';
import AuthorModel from "./schema.js"
import createHttpError from 'http-errors';
import q2m from "query-to-mongo"


const authorsRouter = new express.Router()

authorsRouter.post("/", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body) // here is validation phase of req.body

        const {_id} = await newAuthor.save() // here we save to DB also destructuring newPost to send only _id back to FE 
        res.status(201).send({_id})

    } catch (error) {
        next(error)
    }
}) 


authorsRouter.get("/", async (req, res, next) => {
    try {
        const mongoQuery = q2m(req.query)
        console.log(mongoQuery)
        const total = await AuthorModel.countDocuments(mongoQuery.criteria)
        const posts = await AuthorModel.find(mongoQuery.criteria)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
        res.send({ links: mongoQuery.links("/authors", total), pageTotal: Math.ceil(total / mongoQuery.options.limit), total, posts })
      } catch (error) {
          next(error)
      }
  }) 

// blogsRouter.get("/", async (req, res, next) => {
//     try {
//         const posts = await BlogModel.find() // inside .find() we can provide filters as argument
//         res.status(200).send(posts)
//     } catch (error) {
//         next(error)
//     }
// })

authorsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id

        const post = await AuthorModel.findById(id)
        if(post) {
            res.status(200).send(post)
        } else {
            next(createHttpError(404, `Author with id ${id} not found`)) // not working 
        }
    } catch (error) {
        next(error)
    }
})

authorsRouter.put("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const updatedAuthor =  await AuthorModel.findByIdAndUpdate(id, req.body, {new: true }) // {new:true} to see the updated post in res
       if(updatedAuthor){
           res.status(200).send(updatedAuthor)
       } else {
        next(createHttpError(404, `Author with id ${id} not found`))
       }
    } catch (error) {
        next(error) 
    }
})

authorsRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const authorToDelete = await AuthorModel.findByIdAndDelete(id)
        if(authorToDelete){
        res.send(`Author post with ${id} deleted successfully`)}
        else {
            next(createHttpError(404, `Not able to delete, author with id ${id} not found.`))
        }
    } catch (error) {
        next(error)
    }
})

export default authorsRouter
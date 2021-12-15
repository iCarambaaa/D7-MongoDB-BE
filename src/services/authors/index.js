import express from 'express';
import AuthorModel from "./schema.js"
import createHttpError from 'http-errors';
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { adminOnlyMiddleware } from "../../auth/admin.js"
import { JWTAuthMiddleware } from "../../auth/tokens.js"
import { JWTAuth } from "../../auth/tools.js"

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


authorsRouter.get("/", basicAuthMiddleware, async (req, res, next) => {
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

authorsRouter.get("/:id", basicAuthMiddleware, async (req, res, next) => {
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

authorsRouter.put("/me", basicAuthMiddleware, async (req, res, next) => {
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

authorsRouter.delete("/me", basicAuthMiddleware, async (req, res, next) => { // user self delete
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

authorsRouter.delete("/:id", basicAuthMiddleware, adminOnlyMiddleware, async (req, res, next) => { // admin user delete
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

// REGISTER author (user) same as POST new author before
authorsRouter.post("/register", async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel(req.body) // here is validation phase of req.body
        const {_id} = await newAuthor.save() // here we save to DB also destructuring newPost to send only _id back to FE 
        res.status(201).send({_id})

    } catch (error) {
        next(error)
    }
}) 

// LOGIN
authorsRouter.post("/login", async (req, res, next) => {
    try {
        // 1. Get credentials from req.body
        const { email, password } = req.body
    
        // 2. Verify credentials
        const user = await AuthorModel.checkCredentials(email, password)
    
        if (user) {
          // 3. If credentials are fine we are going to generate an access token
          const accessToken = await JWTAuth(user)
          res.send({ accessToken })
        } else {
          // 4. If they are not --> error (401)
          next(createHttpError(401, "Credentials not ok!"))
        }
      } catch (error) {
        next(error)
      }


})




export default authorsRouter
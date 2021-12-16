import mongoose from "mongoose";
import bcrypt from "bcrypt"
import isEmail from 'validator/lib/isEmail.js';

const { Schema, model } = mongoose;

const AuthorSchema = new Schema({

  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, validate: [isEmail, 'invalid email'], unique: true },
  "date of birth": { type: Date, required: true },
  avatar: { type: String, required: false },
  password: { type: String, required: true },
  googleId: { type: String },
  role: { type: String, default: "author", enum: ["author", "Admin"] }

}, {
  timestamps: true, // adds createdAt & updatedAt     
})

// BEFORE saving the author in database, hash the password
AuthorSchema.pre("save", async function (next) { // NO ARROWS here
  const newAuthor = this
  const plainPassword = newAuthor.password
  if (newAuthor.isModified("password")) {
    const hash = await bcrypt.hash(plainPassword, 11)
    newAuthor.password = hash
  }
  next()
})



// don't send password back in res
AuthorSchema.methods.toJSON = function () {
  // this function is called automatically by express EVERY TIME it does res.send()

  const authorDocument = this
  const authorObject = authorDocument.toObject()
  delete authorObject.password // THIS IS NOT GOING TO AFFECT THE DATABASE
  delete authorObject.__v

  return authorObject
}

// check request headers basic auth here for matches in mongoDB
AuthorSchema.statics.checkCredentials = async function (email, plainPassword) {
  // 1. find the author by email
  const author = await this.findOne({ email }) // "this" refers to the authorModel

  if (author) {
    // 2. if author is found --> compare plainPassword with hashed one
    const isMatch = await bcrypt.compare(plainPassword, author.password)
    if (isMatch) {
      // 3. if they match --> return a proper response
      return author
    } else {
      // 4. if they don't --> return null
      return null
    }
  } else {
    return null // also if email is not ok --> return null
  }
}

export default model("Author", AuthorSchema);
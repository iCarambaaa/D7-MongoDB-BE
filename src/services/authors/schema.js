import mongoose from "mongoose";
import isEmail from 'validator/lib/isEmail.js';

const { Schema, model } = mongoose;

const AuthorSchema = new Schema({

    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true, validate: [ isEmail, 'invalid email' ], unique: true },
    "date of birth": {type: Date, required: true},
    avatar: {type: String, required: false}
 
},{   
        timestamps: true, // adds createdAt & updatedAt     
})

export default model("Author", AuthorSchema);
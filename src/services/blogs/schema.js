import mongoose from "mongoose";

const { Schema, model } = mongoose;



const comment  = new Schema(  {
  text: { type: String, required: true },
  rate: { type: Number, required: true },
}, {timestamps: true }
)



const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      // this way order is messed up in res
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true,
      },
    },
    // author: {
    //   // this way the order is kept in order
    //   type: Object,
    //   required: true,
    //   nested: {
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //     avatar: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // },
    author: {type: Schema.Types.ObjectId, ref: "Author"},

    // this one obviously is an array of objects
    comments: {
      type: [
        comment
      ],
      required: true,
    },
    content: { type: String, required: true },
    likes: {type: Array}
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);


// custum GET function 
// Needs to be a normal function because of "this" keyword. If we use normal function, "this" will refer to BookModel
// USAGE inside router--> BlogModel.findBlogsWithAuthors(mongoQuery)

blogsSchema.static("findBlogsWithAuthors", async function (query) {     
const total = await this.countDocuments(query.criteria)
const posts = await this.find(query.criteria)
.limit(query.options.limit)
.skip(query.options.skip)
.sort(query.options.sort)
.populate({ path: "author", select: "name surname" }) // joins author & blogs and sends back with only seleted fields 

return {total, posts}
})

export default model("Blog", blogsSchema); // link to "blogs" collection, if not there it will be created

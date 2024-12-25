const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BlogPostSchema = new schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    reviews: [
        {
        type: schema.Types.ObjectId,
        ref: "Review",
        },
        ],
})

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
module.exports = BlogPost;
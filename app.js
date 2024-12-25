const express = require("express");
const app = express();
const mongoose = require("mongoose");
const BlogPost = require("./models/editor.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const multer = require("multer");
const methodOverride = require("method-override");
const fs = require("fs");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {BlogPostSchema, reviewSchema} = require("./schema.js"); 
const Review = require("./models/review.js");


// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/beautyWithCare";
main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
     await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/ckeditor', express.static(path.join(__dirname, 'public', 'ckeditor')));

// middleware for schema validation
const validateBlogPost = (req, res, next) =>{
    let {error} = BlogPostSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

const validateReview = (req, res, next) =>{
    console.log(req.body);
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// Set up Multer for image uploads in 'public/image' folder
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images'));
},
   filename: (req, file, cb) => {
       cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});
const upload = multer({ storage: storage }); 



// routing to root
app.get("/", (req, res) => {
    res.send("Hi I am root");
});

// home route
app.get("/home", (req, res) => {
    res.render("pages/home.ejs");
});

// blog route
app.get("/home/blog", wrapAsync( async(req, res) =>{
    const AllBlogs = await BlogPost.find({});
    res.render("pages/blog.ejs", {AllBlogs});
}));


// get request form blog page to editor page
app.get("/home/Editor", (req, res) =>{
    res.render("pages/editor.ejs");
});

// show route
app.get("/home/blog/:id", wrapAsync( async(req, res)=>{
    let {id} = req.params;
    let blog = await BlogPost.findById(id).populate("reviews");
    res.render("pages/show.ejs", {blog});
}));

// Edit route
app.get("/home/:id/edit", wrapAsync( async(req, res) =>{
    let {id} = req.params;
    const blog = await BlogPost.findById(id);
    res.render("pages/edit.ejs", {blog});
}));

// Update route
app.put("/home/blog/:id", upload.single('Image'), validateBlogPost, wrapAsync( async(req, res) =>{
   
    let{id} = req.params;
    let blog = await BlogPost.findByIdAndUpdate(id);
    if (!blog) return res.status(404).send('Blog not found');
    blog.title = req.body.title;
    blog.content = req.body.content;
    if(req.file){
        const oldImagePath = path.join(__dirname, 'public', blog.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        blog.image = `/images/${req.file.filename}`;
    }
         await blog.save();
         res.redirect(`/home/blog`);
    
}));

// Delete Route
app.delete("/home/blog/:id",wrapAsync( async(req, res)=>{
    let {id} = req.params;
    let blog = await BlogPost.findById(id);
    if(blog){
        let oldImagePath = path.join(__dirname, 'public', blog.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
    let deleteBlog = await BlogPost.findByIdAndDelete(id);
    
    console.log(deleteBlog);
    res.redirect("/home/blog");
   
}));

// post request from editor page to blog page
app.post("/home/blog", upload.single('Image'), wrapAsync( async (req, res) =>{
       const { title, content } = req.body;
    const imagePath = req.file ? `/images/${req.file.filename}` : null;
    const newPost = new BlogPost({ title, content , image: imagePath });
       await newPost.save();
       console.log(newPost);    
       res.redirect("/home/blog" );
}));

// Review section
// post new review
app.post("/home/blog/:id/reviews", validateReview, wrapAsync( async( req, res) => {

      let newPost = await BlogPost.findById(req.params.id);
      let newReview = new Review(req.body.review);
      newPost.reviews.push(newReview);
      await newReview.save();
      await newPost.save();
      res.redirect(`/home/blog/${newPost._id}`);
}));

// })


// app.get("/blog", (req, res) => {
//     res.render("pages/blog.ejs");
// })

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "something went wrong"} = err;
       res.render("pages/error.ejs", {message});
    //   res.status(statusCode).send(message );
});


app.listen( 8000, ()=>{
    console.log("server is listening to the port 8000");
});


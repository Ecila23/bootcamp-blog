var expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    express             = require ("express"),
    app                 = express();

// APP CONFIG
mongoose.connect(process.env.DATABASEURL);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now},
    author: String
});
var Blog = mongoose.model("Blog", blogSchema);

// CREATE EXAMPLE BLOG
// Blog.create({
//     title: "Example Blog Post",
//     image: "https://cdn.pixabay.com/photo/2018/05/24/11/19/blogger-3426394__340.jpg",
//     body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras malesuada lorem et ligula condimentum consectetur. Curabitur accumsan arcu nec ex rutrum fringilla. Curabitur commodo tempus risus, nec venenatis lectus pellentesque vitae. Etiam egestas, justo et posuere congue, purus lacus aliquet felis, at venenatis diam est in augue. Ut pretium dolor tortor, sit amet varius ipsum viverra vel. Sed a pulvinar sapien, id molestie odio. Suspendisse tempor odio eu urna aliquet, in venenatis libero posuere. Curabitur ante risus, feugiat in pellentesque et, facilisis eu massa. Nulla ut euismod odio. Cras condimentum luctus dignissim. Phasellus quis volutpat lorem. In dignissim ultrices justo, ut malesuada massa pharetra eget. Fusce a mi vel dui ultrices pharetra. Sed tincidunt metus nec ligula bibendum, sit amet iaculis nibh cursus.",
//     author: "Anon"
// });

//RESTFUL ROUTES
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
   res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog})
        }
    })
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SERVER CONFIRMATION
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog Server Running");
});
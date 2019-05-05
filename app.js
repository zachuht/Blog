const methodOverride   = require("./node_modules/method-override"),
      expressSanitizer = require("./node_modules/express-sanitizer"),
      MongoClient      = require('./node_modules/mongodb').MongoClient,
      bodyParser       = require("./node_modules/body-parser"),
      express          = require("./node_modules/express"),
      mongoose         = require("mongoose"),
      app              = express(),
      port             = 3000;

//Config
mongoose.connect('mongodb+srv://dbUser:Password@cluster0-jcz20.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});
//mongoose.connect('mongodb://localhost:27017/zuht_blog', { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Model Config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now },
});
var Blog = mongoose.model("Blog", blogSchema);

//Routes
app.get("/", (req, res) => res.redirect("/blogs"));

//INDEX
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("ERROR");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//NEW
app.get("/blogs/new", (req, res) => res.render("new"));

//CREATE
app.post("/blogs", function(req, res){
  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

//EDIT
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
});

//UPDATE
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

//DELETE
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

//Contact Page
app.get("/contact", function(req, res){
  res.render("contact");
});

//listen for server
app.listen(process.env.PORT || port, () => console.log(`Blog app listening on port ${port}!`))
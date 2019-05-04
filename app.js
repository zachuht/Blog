const methodOverride   = require("method-override"),
      expressSanitizer = require("express-sanitizer"),
      MongoClient      = require('mongodb').MongoClient,
      bodyParser       = require("body-parser"),
      express          = require("express"),
      mongoose         = require("mongoose"),
      app              = express(),
      port             = 3000;

//Config
mongoose.connect('mongodb://localhost:27017/zuht_blog', { useNewUrlParser: true });
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

//INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log("ERROR");
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => res.render("new"));

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
      res.render("show", {blog: foundBlog});
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
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

//DELETE ROUTE
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

//Searchbar Function
function searchFunction(){
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName("li");
  for(i = 0; i < li.length; i++){
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

//listen for server
app.listen(port, () => console.log(`Blog app listening on port ${port}!`))
const methodOverride        = require("./node_modules/method-override"),
      expressSanitizer      = require("./node_modules/express-sanitizer"),
      MongoClient           = require('./node_modules/mongodb').MongoClient,
      bodyParser            = require("./node_modules/body-parser"),
      passportLocalMongoose = require("passport-local-mongoose"),
      express               = require("./node_modules/express"),
      Blog                  = require("./models/blog"),
      User                  = require("./models/user"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      app                   = express(),
      port                  = 3000;

//CHOOSE DATABASE
mongoose.connect('mongodb+srv://dbUser:Password@cluster0-jcz20.mongodb.net/test?retryWrites=true', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});
// mongoose.connect('mongodb://localhost:27017/zuht_blog', { 
//   useNewUrlParser: true
// }).then(() => {
//   console.log('Connected to Local DB')
// }).catch(err => {
//   console.log('ERROR', err.message);
// });

//CONFIG
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(require("express-session")({
  secret: "This is my secret phrase",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//AUTH ROUTES
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/blogs");
        });
    });
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

//INDEX
app.get("/", (req, res) => res.redirect("/blogs"));

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
app.get("/blogs/new", isLoggedIn, (req, res) => res.render("new"));

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

//CONTACT
app.get("/contact", function(req, res){
  res.render("contact");
});

//listen for server
app.listen(process.env.PORT || port, () => console.log(`Blog app listening on port ${port}!`))
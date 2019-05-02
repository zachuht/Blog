const bodyParser = require("body-parser"),
      express    = require("express"),
      mongoose   = require("mongoose"),
      app        = express(),
      port       = 3000;

//config
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//blogSchema
let Schema = mongoose.Schema;

let blogSchema = new Schema({
  name: String,
  image: String,
  body: String,
  date: { type: Date, default: Date.now },
});
let Blog = mongoose.model("Blog", blogSchema);

//routes
app.get("/", (req, res) => res.render("home"));

//Homepage
app.get("/blogs", (req, res) => res.redirect("/"));

//New Blog Page
app.get("/new", (req, res) => res.render("new"));

//listen for server
app.listen(port, () => console.log(`Blog app listening on port ${port}!`))
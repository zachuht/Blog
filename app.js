const bodyParser = require("body-parser"),
      express    = require("express"),
      mongoose   = require("mongoose"),
      app        = express(),
      port       = 3000;

//config
app.use(express.static("public"));
app.set("view engine", "ejs");

//blogSchema
let blogSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

//routes
app.get('/', (req, res) => res.render('home'));

app.get('/new', (req, res) => res.render('new'));

//listen for server
app.listen(port, () => console.log(`Blog app listening on port ${port}!`))
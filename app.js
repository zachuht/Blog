const bodyParser = require("body-parser"),
      express    = require("express"),
      mongoose   = require("mongoose"),
      app        = express(),
      port       = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', (req, res) => res.render('home'));

app.get('/new', (req, res) => res.render('new'));

app.listen(port, () => console.log(`Blog app listening on port ${port}!`))
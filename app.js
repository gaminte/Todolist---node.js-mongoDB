//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

const port = process.env.PORT || 3000
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-santy:test123@cluster0.gee3wai.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema ({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", function(req, res) {
  Item.find({}).then(data => {
    res.render("list", {listTitle: "Today", 
    newListItems: data,
    url: "/",
    delUrl: "/delete", 
  });
  });
});

app.post("/", function(req, res) {
  Item.create({name: req.body.newItem});
  res.redirect("/");
});

app.post("/delete", async function(req, res) {
  await Item.findByIdAndRemove(req.body.check);
  res.redirect("/");
});

let param;
let model;
let modelItems;

app.get("/:custom", async function(req,res) {
  param = lodash.capitalize(lodash.camelCase(req.params.custom));
  model = mongoose.model(param, itemsSchema);
  modelItems = await model.find();

  res.render("list", {
    listTitle: param,
    newListItems: modelItems,
    url: `/${param}`,
    delUrl: `/${param}/delete`,
  });
});

app.post("/:custom", function(req, res) {
  model.create({name: req.body.newItem});
  res.redirect(`/${param}`);
});

app.post("/:custom/delete", async function(req, res) {
  await model.findByIdAndRemove(req.body.check);
  res.redirect(`/${param}`);
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(port, function() {
  console.log("Server started on port 3000");
});

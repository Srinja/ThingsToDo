//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/thingsDB",{ useNewUrlParser: true,useUnifiedTopology: true });

const itemSchema=mongoose.Schema({
  item:String
});

const Item=mongoose.model("Item",itemSchema);


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res) {

const day = date.getDate();
Item.find(function(err,foundResult){
  if(!err){
    res.render("list", {listTitle: day, newListItems:foundResult});
  }else{
    console.log(err);
  }
});
});

app.post("/", function(req, res){

  const item = new Item({
    item:req.body.newItem
  });

  item.save();
  //items.push(item);
  res.redirect("/");

});


app.post("/delete", function(req, res){
  const checkedItemId=req.body.checked;

  Item.findByIdAndRemove(checkedItemId,function(err,foundItem){
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

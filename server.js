"use strict";

const express = require("express");
const jsonData  = require("./MovieData/data.json");
const app = express();
const { response } = require("express");
app.use(express.json());

const favoriteHandler = (req, res) => {
  res.status(200).send("Welcome to Favorite Page");
};
app.get("/favorite", favoriteHandler);


function Movie(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

const formattedData = new Movie(
  jsonData.title,
  jsonData.poster_path,
  jsonData.overview
);
app.get('/', formattedDatar);

function formattedDatar(req, res){
   
    return res.status(200).json(formattedData);

};




//The pice of code which make my server work.
app.listen(7979, () => {
  console.log("Listen on 4000");
});
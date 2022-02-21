'use strict';
const express = require("express");
const cors = require("cors");
const recipes = require("data.json");
const app = express();
app.use(express.json());

const favoriteHandler = (req, res) => {
  res.status(200).send("Welcome to Favorite Page");
};
app.get("/favorite", favoriteHandler);


function Recipe(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

app.get('/', recipesHandler);

function recipesHandler(req, res){
    // console.log(recipes);
    let result = [];
    recipes.data.forEach((value) => {
        let oneRecipe = new Recipe (value.title, value.genre_ids,value.original_language, value.original_title, value.poster_path, value.video, value.vote_average,value.overview,value.release_date,value.vote_count,value.id,value.adult,value.backdrop_path,value.popularity,value.media_type);
        result.push(oneRecipe);
    });
    return res.status(200).json(result);
};




//The pice of code which make my server work.
app.listen(4000, () => {
  console.log("Listen on 4000");
});
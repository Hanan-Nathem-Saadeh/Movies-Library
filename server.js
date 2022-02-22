"use strict";

const express = require("express");
const moviesData  = require("./MovieData/data.json");
const app = express();
const { response } = require("express");
app.use(express.json());


function favoriteHandler(request, response){
    
    return response.send("Welcome to Favorite Page");
};


function Movie(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}

const formattedData = new Movie(
    moviesData.title,
    moviesData.poster_path,
    moviesData.overview
);

function formattedDatar(req, res){
   
    return res.status(200).json(formattedData);

};
function notFoundHandler(req, res){
    return res.status(404).send("Not Found");
}
// const errorHandler = (error, req, res) => {
//   const err = {
//     status: 500,
//     message: error.message,
//   };
//   res.status(500).send(err);
// };
app.get('/', formattedDatar);
app.get("/favorite", favoriteHandler);
app.use("*", notFoundHandler);

app.listen(3003, () => {
    console.log("Listen on 3000");
});

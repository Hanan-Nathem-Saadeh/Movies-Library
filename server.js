"use strict";

const express = require("express");
const jsonData  = require("./MovieData/data.json");
const app = express();
const { response } = require("express");
app.use(express.json());
const axios = require("axios");
const dotenv=require("dotenv");
dotenv.config();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
const favoriteHandler = (req, res) => {
  res.status(200).send("Welcome to Favorite Page");
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
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
function formattedDatar(req, res){   
    return res.status(200).json(formattedData);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
function APIMovie(id, title, releaseDate, posterPath, overview) {
  this.id = id;
  this.title = title;
  this.release_date = releaseDate;
  this.poster_path = posterPath;
  this.overview = overview;
}
/////////////////////////////////////
const APIKEY = process.env.APIKEY;
// app.get("/accountHandler", accountHandler);
 app.get("/search", searchHandler);
app.get("/trending", trendingHandler);
app.get("/favorite", favoriteHandler);
app.get('/', formattedDatar);
app.get("/top_rated",topRatedHandler);
app.get("/popular",popularHandler)
/////////////////////////////////////////////////
function trendingHandler(req, res){
    axios
  .get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}`)
  .then((result) => {
    return res.status(200).json(
      result.data.results.map((movie) => {

          return new APIMovie(
            movie.id,
            movie.title,
            movie.release_date,
            movie.poster_path,
            movie.overview
          );
        })
      );
    })
    .catch((error) => errorHandler(error, req, res));
};
// ///////////////////////////////////////////////////////////////
function popularHandler (req, res) {
  let results = [];
  axios
  .get(`https://api.themoviedb.org/3/movie/popular?api_key=${APIKEY}&language=en-US&page=1`)
  .then(response=>{
    response.data.results.map(value => {
      let popularMovie = new APIMovie(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A")
      results.push(popularMovie);
  });
  return res.status(200).json(results);
    })
    .catch((error) => errorHandler(error, req, res));
};
////////////////////////////////////////////////////////////////
function searchHandler(req, res){
  const query = req.query.search;
  // const page=req.query.page;
  let results = [];
  axios
  .get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${query} `)
  .then(response=>{
    response.data.results.map(value => {
      let oneMovie = new APIMovie(value.id || "N/A", value.title || "N/A", value.release_date || "N/A", value.poster_path || "N/A", value.overview || "N/A")
      results.push(oneMovie);
  });
  return res.status(200).json(results);
  })
       .catch((error) => errorHandler(error, req, res));
   };


//////////////////////////////////////////////////////////////////////////////////
   function topRatedHandler (req, res){
    const page=req.query.page;

    axios
      .get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&language=en-US&&page=${page}`
      )
      .then((response) => {
        return res.status(200).json(
          response.data.results.map((movie) => {
            return new APIMovie(
              movie.id,
              movie.title,
              movie.release_date,
              movie.poster_path,
              movie.overview
            );
          })
        );
      })
      .catch((error) => errorHandler(error, req, res));
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const errorHandler = (error, req, res) => {
  const err = {
    status: 500,
    message: error.message,
  };
  res.status(500).send(err);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function notFoundHandler(req, res){
  return res.status(404).send("Not Found");
}
app.use("*", notFoundHandler);

//The pice of code which make my server work.
app.listen(10000, () => {
  console.log("Listen on 3000");
});

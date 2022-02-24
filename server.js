"use strict";

const express = require("express");
const moviesData  = require("./MovieData/data.json");
const app = express();
const { response } = require("express");
app.use(express.json());
const axios = require("axios");

const dotenv=require("dotenv");
const pg = require("pg");
const DATABASE_URL = process.env.DATABASE_URL;
dotenv.config();

//////////////////////////////////////////////////////////////////////////////////////////////////////////
const favoriteHandler = (req, res) => {
  res.status(200).send("Welcome to Favorite Page");
};
app.get("/favorite", favoriteHandler);
//////////////////////////////////////////////////////////////////////////////////////////////////////////






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

function APIMovie(id, title, releaseDate, posterPath, overview) {
  this.id = id;
  this.title = title;
  this.release_date = releaseDate;
  this.poster_path = posterPath;
  this.overview = overview;
}
/////////////////////////////////////
const APIKEY = process.env.APIKEY;
app.get("/certification", certification);
app.get("/search", searchHandler);
app.get("/trending", trendingHandler);
app.get("/favorite", favoriteHandler);
app.get('/', formattedDatar);
////////////////////////////////////////////////
function trendingHandler(req, res){
  const query = req.query.trendingHandler
  axios
  .get(`https://api.themoviedb.org/3/trending/all/week?api_key=${APIKEY}`)
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

///////////////////////////////////////////////////////////////
   function certification(req, res){
    const query = req.query.certification
    axios
    .get(`https://api.themoviedb.org/3/certification/movie/list?api_key=${APIKEY}`)
    .then(response=>{
      return res.status(200).json(response.data.results);
    })
         .catch((error) => errorHandler(error, req, res));
     };
     ////////////////////////////////////////////////////////////////
function searchHandler(req, res){
  const query = req.query.searchHandler;
  axios
  .get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${query}&page=2`)
  .then(response=>{
    return res.status(200).json(response.data.results);
  })
       .catch((error) => errorHandler(error, req, res));
   };

   function topRatedHandler (req, res) {
    const query = req.query.topRatedHandler
    axios
      .get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${APIKEY}&page=1`
      )
      .then((response) => {
        return res.status(200).json(
          response.data.results.map((mov) => {
            return new APIMovie(
              mov.id,
              mov.title,
              mov.release_date,
              mov.poster_path,
              mov.overview
            );
          })
        );
      })
      .catch((error) => errorHandler(error, req, res));
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//task13
const addMovieHandler = (req, res) => {
  const movie = req.body;
  console.log(movie);
  const sql = `INSERT INTO fav(title, releaseDate, posterPath, overview, comment) VALUES($1, $2, $3, $4, $5)`;
  const values = [
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.overview,
    movie.comment,
  ];
  client
    .query(sql, values)
    .then((data) => {
      return res.status(201).json(data.rows);
    })
    .catch((error) => errorHandler(error, req, res));
};


const getMovieHandler = (req, res) => {
  const sql = `SELECT * FROM fav`;

  client
    .query(sql)
    .then((data) => {
      return res.status(200).json(data.rows);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

app.post("/addMovie", addMovieHandler);
app.get("/getMovie", getMovieHandler);
//////////////////////////////////////////////////////////////////////////////////////
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
app.listen(3007, () => {
  console.log("Listen on 3000");
});



app.get('/', formattedDatar);






"use strict";

const express = require("express");
const jsonData  = require("./MovieData/data.json");
const app = express();
const axios = require("axios");
const dotenv=require("dotenv");
const pg =require("pg");
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);
const PORT = process.env.PORT || 3001;
const APIKEY = process.env.APIKEY;
app.use(express.json());

// ///////////////////////////////////////////////////////////////////////////////////////////////////
 
app.get("/search", searchHandler);
app.get("/trending", trendingHandler);
app.get("/favorite", favoriteHandler);
app.get('/', formattedDatar);
app.get("/top_rated",topRatedHandler);
app.get("/popular",popularHandler);
app.post("/addFavMovie", addFavMovieHandler);
app.get("/getMovie", getMovieHandler);
app.put("/udpateFavMovie/:id", udpateFavHandler);
app.delete("/delete/:id", deleteMovieHandler);
app.get("/getFavMovie/:id", getFavMovieHandler);

// //////////////////////////////////////////////////////////////////////////////////////////////////////////
function Movie(title, posterPath, overview) {
  this.title = title;
  this.posterPath = posterPath;
  this.overview = overview;
}
function APIMovie(id, title, releaseDate, posterPath, overview) {
  this.id = id;
  this.title = title;
  this.release_date = releaseDate;
  this.poster_path = posterPath;
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
function favoriteHandler  (req, res) {
      res.status(200).send("Welcome to Favorite Page");
    };

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
// // ///////////////////////////////////////////////////////////////
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
// ////////////////////////////////////////////////////////////////
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


// //////////////////////////////////////////////////////////////////////////////////
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
// ///TASK13

function addFavMovieHandler  (req, res)  {
  const movie = req.body;
  const sql = `INSERT INTO fav(title, release_date, poster_path, overview, comment) VALUES($1, $2, $3, $4, $5) RETURNING *`
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

function getMovieHandler  (req, res)  {
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



//TASK14
function udpateFavHandler  (req, res) {
  const id = req.params.id;
  const movie = req.body;
  const values = [
    movie.title,
    movie.release_date,
    movie.poster_path,
    movie.overview,
    movie.comment,
  ];
  const sql = `UPDATE fav
    SET title=$1, releaseDate=$2, posterPath=$3, overview=$4, comment=$5
    WHERE id=${id} RETURNING *;`;

  client
    .query(sql, values)
    .then((data) => res.status(200).json(data.rows))
    .catch((error) => errorHandler(error, req, res));
};

function deleteMovieHandler  (req, res)  {
  const id = req.params.id;
  const sql = `DELETE FROM fav WHERE id=${id};`;

  client
    .query(sql)
    .then(() => res.status(203).json())
    .catch((error) => errorHandler(error, req, res));
};

function getFavMovieHandler  (req, res) {
  const id = req.params.id;
  const sql = `SELECT * FROM fav WHERE id=${id}`;

  client
    .query(sql)
    .then((data) => res.status(200).json(data.rows))
    .catch((error) => errorHandler(error, req, res));
};



// //////////////////////////////////////////////////////////////////////////////////////////////////////////
function errorHandler  (error, req, res)  {
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
client.connect()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Listen on ${PORT}`);
    });
});
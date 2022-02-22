"use strict";

const express = require("express");
const jsonData  = require("./MovieData/data.json");
const app = express();
const { response } = require("express");
app.use(express.json());
const axios = require("axios");

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
  jsonData.title,
  jsonData.poster_path,
  jsonData.overview
);
app.get('/', formattedDatar);

function formattedDatar(req, res){
   
    return res.status(200).json(formattedData);

};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function APIMovie(id, title, releaseDate, posterPath, overview) {
  this.id = id;
  this.title = title;
  this.release_date = releaseDate;
  this.poster_path = posterPath;
  this.overview = overview;
}
///////////////////////////////////////////////
const APIKEY = process.env.APIKEY;

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



app.get("/trending", trendingHandler);



function companies(req, res){
  const query1 = req.query1.companies
  axios
  .get(`https://api.themoviedb.org/3/movie/changes?api_key=${APIKEY}`)
  .then(companies=>{
    return res.status(200).json(companies.data.results);
  })
       .catch((error) => errorHandler(error, req, res));
   };
   app.get("/companies", companies);



   function certification(req, res){
    const query2 = req.query2.certification
    axios
    .get(`https://api.themoviedb.org/3/certification/movie/list?api_key=${APIKEY}`)
    .then(certification=>{
      return res.status(200).json(certification.data.results);
    })
         .catch((error) => errorHandler(error, req, res));
     };
     app.get("/certification", certification);


function serchr(req, res){
  const query = req.query.search
  axios
  .get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${APIKEY}&query=${search}`)
  .then(serchr=>{
    return res.status(200).json(serchr.data.results);
  })
       .catch((error) => errorHandler(error, req, res));
   };
   app.get("/search", serchr);


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
app.listen(3000, () => {
  console.log("Listen on 3000");
});


ss
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
app.get("/certification", certification);
app.get("/favorite", favoriteHandler);
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
const errorHandler = (error, req, res) => {
  const err = {
    status: 500,
    message: error.message,
  };
  res.status(500).send(err);
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////


//The pice of code which make my server work.
app.listen(3007, () => {
  console.log("Listen on 3000");
});


DROP TABLE IF EXISTS fav;

CREATE TABLE IF NOT EXISTS fav (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250),
    release_date VARCHAR(250),
    poster_path VARCHAR(250),
    overview VARCHAR(1000),
    comment VARCHAR(250)
)

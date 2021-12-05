import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async() => {
    setIsLoading(true);
    setError(null);
    try {
      // fetch() returns a response so we must await it
      const response = await fetch("https://react-movie-http-95492-default-rtdb.europe-west1.firebasedatabase.app/movies.json");
      if (!response.ok) {
        // trigger catch block
        throw new Error("Something went wrong.");
      }
      // json() transform json to js object and returns a promise so we must await it
      const data = await response.json();
      let loadedMovies = [];
      for (let key in data) {
        loadedMovies.push({
          id : key,
          title : data[key].title,
          openingText : data[key].openingText,
          releaseDate : data[key].releaseDate
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  // We need to use useCallback on the function dependency (objects are of reference type)
  useEffect(() => {
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    // returns a promise so we must await it
    const response = await fetch("https://react-movie-http-95492-default-rtdb.europe-west1.firebasedatabase.app/movies.json",{
      method: 'POST',
      // stringify turns JS object or [] in JSON
      body : JSON.stringify(movie),
      headers : {
        'Content-Type': 'application/json'
      }
    });
    // json() transform json to js object and returns a promise so we must await it
    const data = await response.json();
  }

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

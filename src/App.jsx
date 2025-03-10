import { useState ,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import { useDebounce } from 'react-use'

import './App.css'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { getTrendingMovies, updateSearchCount } from './appwrite.js'
import Footer from './components/Footer.jsx'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
}
}
function App() {
  const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term
  const [errorMessage,setErrorMessage] = useState(''); // State to hold the error message
  const [isLoading,setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState([]); // State to hold the list of movies
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerm,setDebouncedSearchTerm] = useState('');

//debounce the search term to avoid making too many requests
//useDebounce is a custom hook that debounces the search term
  useDebounce(() =>
    setDebouncedSearchTerm(searchTerm),500,[searchTerm])
  
  const fetchMovies = async (query ='') =>{
    setIsLoading(true);
    setErrorMessage('');


    try{
      //if query then search query else fetch popular movies
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint,API_OPTIONS);

      if(!response.ok){
        throw Error('Failed to fetch movies');
      }
      const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);//fill the movieList state with the fetched movies

      if(query && data.results.length > 0){
      await  updateSearchCount(query,data.results[0]);
      }
      
    }
    catch(error){
      console.error(`error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }

    finally{
      setIsLoading(false);  
  }

}

const loadTrendingMovies = async () => {
  try{
    const movies = await getTrendingMovies();
    setTrendingMovies(movies);
  }
  catch(error){
    console.error(`error loading trending movies: ${error}`);
}
}
  useEffect(() =>{
    fetchMovies(debouncedSearchTerm);
  },[debouncedSearchTerm]);

  useEffect(() =>{
    loadTrendingMovies();
  },[]);

  return (
    <main>
      <div className='pattern'></div>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="hero banner" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy without the hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm ={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index) =>(
                <li key={movie.$id}>
                  <p>{index+1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>   
          </section>
        )}
        <section className='all-movies'>
          <h2 >All Movies</h2>

          {isLoading ? (
            <Spinner/>
          ):errorMessage?(
            <p className='text-red-500'>{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie) =>(
                <MovieCard key={movie.id} movie ={movie}/>
              ))}
            </ul>
          )}

          
        </section>
        
       <Footer/>
      </div>
    </main>
  )
}

export default App
